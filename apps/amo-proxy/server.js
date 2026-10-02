import { createServer } from "node:http";
import { readFile, rename, writeFile } from "node:fs/promises";
import { timingSafeEqual } from "node:crypto";

const port = Number(process.env.PORT || 8080);
const maxBodyBytes = 16 * 1024;
const requestTimeoutMs = 8_000;
const authFile = process.env.AMO_AUTH_FILE || "/run/secrets/amo_auth";

function text(value, maxLength = 2_000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function numberEnv(name, fallback = 0) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function json(response, status, body) {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

function sameSecret(actual, expected) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length
    && timingSafeEqual(actualBuffer, expectedBuffer);
}

async function readBody(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) throw new Error("body-too-large");
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function readAuth() {
  const raw = await readFile(authFile, "utf8");
  const auth = JSON.parse(raw);

  if (!auth.subdomain || !auth.client_id || !auth.client_secret || !auth.refresh_token) {
    throw new Error("OAuth auth file is incomplete.");
  }

  return auth;
}

async function writeAuth(auth) {
  const temporaryFile = `${authFile}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(auth), { mode: 0o600 });
  await rename(temporaryFile, authFile);
}

function authIsExpired(auth) {
  const timeout = Number(auth.timeOut || 0) * 1_000;
  return !auth.access_token || !timeout || Date.now() >= timeout - 30_000;
}

async function refreshAuth(auth) {
  const body = new URLSearchParams({
    client_id: auth.client_id,
    client_secret: auth.client_secret,
    grant_type: "refresh_token",
    redirect_uri: auth.redirect_uri,
    refresh_token: auth.refresh_token,
  });

  const response = await fetch(`https://${auth.subdomain}.amocrm.ru/oauth2/access_token`, {
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
    signal: AbortSignal.timeout(requestTimeoutMs),
  });

  if (!response.ok) throw new Error(`amoCRM OAuth refresh failed with ${response.status}.`);

  const result = await response.json();
  const nextAuth = {
    ...auth,
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    token_type: result.token_type,
    expires_in: result.expires_in,
    timeOut: Math.floor(Date.now() / 1_000) + Number(result.expires_in || 0),
  };

  await writeAuth(nextAuth);
  return nextAuth;
}

async function getAuth() {
  let auth = await readAuth();
  if (authIsExpired(auth)) auth = await refreshAuth(auth);
  return auth;
}

async function amoRequest(auth, path, options = {}) {
  const response = await fetch(`https://${auth.subdomain}.amocrm.ru/api/v4${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    signal: AbortSignal.timeout(requestTimeoutMs),
  });

  const body = await response.text();
  let parsed;
  try {
    parsed = body ? JSON.parse(body) : null;
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    throw new Error(`amoCRM API ${response.status} for ${path}.`);
  }

  return parsed;
}

async function findContact(auth, value) {
  const query = text(value, 160);
  if (!query) return null;

  const result = await amoRequest(auth, `/contacts?query=${encodeURIComponent(query)}&limit=50`);
  return result?._embedded?.contacts?.[0] || null;
}

function contactFields(phone, email) {
  const fields = [];
  if (phone) fields.push({ field_code: "PHONE", values: [{ enum_code: "WORK", value: phone }] });
  if (email) fields.push({ field_code: "EMAIL", values: [{ enum_code: "WORK", value: email }] });
  return fields;
}

async function createContact(auth, payload) {
  const result = await amoRequest(auth, "/contacts", {
    body: JSON.stringify([{
      name: payload.name || `Контакт ${payload.phone || payload.email || "с сайта"}`,
      custom_fields_values: contactFields(payload.phone, payload.email),
    }]),
    method: "POST",
  });

  const contact = result?._embedded?.contacts?.[0];
  if (!contact?.id) throw new Error("amoCRM did not return a contact id.");
  return contact;
}

async function findOpenLead(auth, value) {
  const query = text(value, 160);
  if (!query) return null;

  const result = await amoRequest(auth, `/leads?query=${encodeURIComponent(query)}&limit=50`);
  const closedStatuses = new Set([142, 143]);
  return result?._embedded?.leads?.find((lead) => !closedStatuses.has(Number(lead.status_id))) || null;
}

function leadFields(formName, utm) {
  const ids = {
    formName: numberEnv("AMO_FORM_FIELD_ID"),
    utmCampaign: numberEnv("AMO_UTM_CAMPAIGN_FIELD_ID"),
    utmContent: numberEnv("AMO_UTM_CONTENT_FIELD_ID"),
    utmMedium: numberEnv("AMO_UTM_MEDIUM_FIELD_ID"),
    utmSource: numberEnv("AMO_UTM_SOURCE_FIELD_ID"),
    utmTerm: numberEnv("AMO_UTM_TERM_FIELD_ID"),
  };
  const values = [];

  const add = (fieldId, value) => {
    if (fieldId && value) values.push({ field_id: fieldId, values: [{ value }] });
  };

  add(ids.formName, formName);
  add(ids.utmSource, utm.utm_source);
  add(ids.utmMedium, utm.utm_medium);
  add(ids.utmCampaign, utm.utm_campaign);
  add(ids.utmContent, utm.utm_content);
  add(ids.utmTerm, utm.utm_term);
  return values;
}

async function createLead(auth, payload) {
  const result = await amoRequest(auth, "/leads", {
    body: JSON.stringify([{
      name: `${process.env.AMO_LEAD_NAME_PREFIX || "Заявка с сайта от "}${payload.name || "клиента"}`,
      pipeline_id: numberEnv("AMO_PIPELINE_ID"),
      status_id: numberEnv("AMO_STATUS_ID"),
      responsible_user_id: numberEnv("AMO_RESPONSIBLE_USER_ID"),
      custom_fields_values: leadFields(payload.formName, payload.utm),
    }]),
    method: "POST",
  });

  const lead = result?._embedded?.leads?.[0];
  if (!lead?.id) throw new Error("amoCRM did not return a lead id.");
  return lead;
}

async function linkLeadAndContact(auth, leadId, contactId) {
  await amoRequest(auth, `/leads/${leadId}/link`, {
    body: JSON.stringify([{ to_entity_id: contactId, to_entity_type: "contacts" }]),
    method: "POST",
  });
}

async function addLeadNote(auth, leadId, textValue) {
  if (!textValue) return;
  await amoRequest(auth, `/leads/${leadId}/notes`, {
    body: JSON.stringify([{ note_type: "common", params: { text: textValue } }]),
    method: "POST",
  });
}

function noteText(payload) {
  return [
    `Имя: ${payload.name || "—"}`,
    `Телефон: ${payload.phone || "—"}`,
    `Email: ${payload.email || "—"}`,
    `Страница: ${payload.page || "—"}`,
    `Форма: ${payload.formName || "—"}`,
    `Способ связи: ${payload.contactMethod || "—"}`,
    `Формат консультации: ${payload.consultationFormat || "—"}`,
    payload.message ? `Сообщение клиента: ${payload.message}` : "",
  ].filter(Boolean).join("\n");
}

async function deliver(payload) {
  const auth = await getAuth();
  const phone = text(payload.phone, 32);
  const email = text(payload.email, 160);
  const existingContact = await findContact(auth, phone) || await findContact(auth, email);
  const contact = existingContact || await createContact(auth, { email, name: text(payload.name, 100), phone });
  const existingLead = await findOpenLead(auth, phone || email);

  if (existingLead) {
    await addLeadNote(auth, existingLead.id, noteText(payload));
    return { leadId: existingLead.id, repeated: true };
  }

  const lead = await createLead(auth, payload);
  await linkLeadAndContact(auth, lead.id, contact.id);
  await addLeadNote(auth, lead.id, noteText(payload));
  return { leadId: lead.id, repeated: false };
}

async function handleForm(request, response) {
  if (request.method !== "POST") return json(response, 405, { error: "Method not allowed" });

  const expectedSecret = text(process.env.AMO_PROXY_SHARED_SECRET, 256);
  const body = new URLSearchParams(await readBody(request));
  const suppliedSecret = text(body.get("code"), 256);
  if (!expectedSecret || !sameSecret(suppliedSecret, expectedSecret)) {
    return json(response, 401, { error: "Unauthorized" });
  }

  const payload = {
    contactMethod: text(body.get("contactMethod"), 64),
    consultationFormat: text(body.get("consultationFormat"), 64),
    email: text(body.get("email"), 160),
    formName: text(body.get("formName"), 160),
    message: text(body.get("message"), 2_000),
    name: text(body.get("name"), 100),
    page: text(body.get("page"), 500),
    phone: text(body.get("phone"), 32),
    utm: Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].map((key) => [key, text(body.get(key), 200)])),
  };

  if (!payload.name || (!payload.phone && !payload.email)) {
    return json(response, 400, { error: "Name and contact are required" });
  }

  if (process.env.AMO_DRY_RUN !== "false") {
    return json(response, 200, { dryRun: true, ok: true });
  }

  try {
    const result = await deliver(payload);
    return json(response, 200, { ...result, ok: true });
  } catch (error) {
    console.error("amoCRM delivery failed", error instanceof Error ? error.message : "unknown error");
    return json(response, 502, { error: "amoCRM delivery failed" });
  }
}

const server = createServer(async (request, response) => {
  try {
    if (request.url === "/health") return json(response, 200, { ok: true });
    if (request.url === "/amo.php") return await handleForm(request, response);
    return json(response, 404, { error: "Not found" });
  } catch (error) {
    const status = error instanceof Error && error.message === "body-too-large" ? 413 : 400;
    return json(response, status, { error: "Invalid request" });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`amo-proxy listening on ${port}`);
});
