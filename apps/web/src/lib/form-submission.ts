const MAX_REQUEST_BYTES = 16 * 1024;
const MIN_FILL_TIME_MS = 1_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const IDEMPOTENCY_TTL_MS = 10 * 60 * 1_000;
const DELIVERY_MAX_ATTEMPTS = 3;
const DELIVERY_RETRY_DELAYS_MS = [250, 750];

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type IdempotencyEntry = {
  expiresAt: number;
  state: "completed" | "processing";
};

class FormProtectionError extends Error {
  constructor(public readonly status: 400 | 503, message: string) {
    super(message);
  }
}

type FormKind = "consultation" | "feedback";

type CommonFormPayload = {
  captchaToken?: unknown;
  formStartedAt?: unknown;
  idempotencyKey?: unknown;
  website?: unknown;
};

type ConsultationPayload = CommonFormPayload & {
  contactMethod?: unknown;
  consultationFormat?: unknown;
  marketingConsent?: unknown;
  name?: unknown;
  personalDataConsent?: unknown;
  phone?: unknown;
  privacyPolicyConsent?: unknown;
  telegramUsername?: unknown;
};

type FeedbackPayload = CommonFormPayload & {
  contact?: unknown;
  marketingConsent?: unknown;
  message?: unknown;
  name?: unknown;
  personalDataConsent?: unknown;
  privacyPolicyConsent?: unknown;
};

type MailpitMessage = {
  From: { Email: string; Name: string };
  To: Array<{ Email: string; Name: string }>;
  Subject: string;
  Text: string;
};

type AmoFormPayload = {
  contact?: string;
  contactMethod?: string;
  consultationFormat?: string;
  message?: string;
  name: string;
  phone?: string;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
const idempotencyStore = new Map<string, IdempotencyEntry>();

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    headers: { "Cache-Control": "no-store" },
    status,
  });
}

function stringValue(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  return normalized && normalized.length <= maxLength ? normalized : null;
}

function isBooleanTrue(value: unknown): boolean {
  return value === true;
}

function getClientIp(request: Request): string | undefined {
  const trustProxyHeaders = process.env.TRUST_PROXY_HEADERS === "true" || process.env.NODE_ENV === "development";
  if (!trustProxyHeaders) return undefined;

  return request.headers.get("x-real-ip")?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || undefined;
}

function getClientKey(request: Request, kind: FormKind): string {
  return `${kind}:${getClientIp(request) || "unknown"}`;
}

function getCookie(request: Request, name: string): string | undefined {
  const cookies = request.headers.get("cookie")?.split(";") ?? [];
  const prefix = `${name}=`;
  const value = cookies.map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(prefix))?.slice(prefix.length);

  if (!value) return undefined;

  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `7${digits}` : digits;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();

  for (const [entryKey, entry] of rateLimitStore) {
    if (entry.resetAt <= now) rateLimitStore.delete(entryKey);
  }

  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  existing.count += 1;
  return existing.count > RATE_LIMIT_MAX_REQUESTS;
}

function getIdempotencyKey(request: Request, payload: CommonFormPayload): string | null {
  const value = request.headers.get("idempotency-key") || stringValue(payload.idempotencyKey, 128);
  if (!value) return null;
  return /^[A-Za-z0-9._:-]{16,128}$/.test(value) ? value : null;
}

function reserveIdempotency(key: string, kind: FormKind): "duplicate" | "processing" | "reserved" {
  const now = Date.now();

  for (const [entryKey, entry] of idempotencyStore) {
    if (entry.expiresAt <= now) idempotencyStore.delete(entryKey);
  }

  const storeKey = `${kind}:${key}`;
  const existing = idempotencyStore.get(storeKey);
  if (existing) return existing.state === "completed" ? "duplicate" : "processing";

  idempotencyStore.set(storeKey, { expiresAt: now + IDEMPOTENCY_TTL_MS, state: "processing" });
  return "reserved";
}

function completeIdempotency(key: string, kind: FormKind): void {
  const entry = idempotencyStore.get(`${kind}:${key}`);
  if (entry) entry.state = "completed";
}

function releaseIdempotency(key: string, kind: FormKind): void {
  idempotencyStore.delete(`${kind}:${key}`);
}

function hasAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const requireOrigin = process.env.REQUIRE_FORM_ORIGIN === "true" || process.env.NODE_ENV === "production";
  if (!origin) return !requireOrigin;

  if (process.env.NODE_ENV === "development" && origin === new URL(request.url).origin) return true;

  const configuredOrigin = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredOrigin) return origin.startsWith("http://localhost:");

  try {
    return new URL(origin).origin === new URL(configuredOrigin).origin;
  } catch {
    return false;
  }
}

function getFormError(kind: FormKind, payload: ConsultationPayload | FeedbackPayload): string | null {
  const name = stringValue(payload.name, 100);
  const formStartedAt = typeof payload.formStartedAt === "number" ? payload.formStartedAt : Number(payload.formStartedAt);
  const elapsedTime = Date.now() - formStartedAt;

  if (!name) return "Проверьте имя.";
  if (!Number.isFinite(formStartedAt) || elapsedTime < MIN_FILL_TIME_MS || elapsedTime > MAX_FORM_AGE_MS) return "Обновите форму и заполните её ещё раз.";
  if (kind === "consultation") {
    const consultation = payload as ConsultationPayload;
    const phone = stringValue(consultation.phone, 32);
    const consultationFormat = consultation.consultationFormat;
    const contactMethod = consultation.contactMethod;

    if (!phone) return "Проверьте телефон.";
    if (consultationFormat !== "clinic" && consultationFormat !== "online") return "Проверьте формат консультации.";
    if (!contactMethod || !["phone", "telegram", "max", "whatsapp"].includes(String(contactMethod))) return "Проверьте способ связи.";
    if (!isBooleanTrue(consultation.personalDataConsent) || !isBooleanTrue(consultation.privacyPolicyConsent)) {
      return "Необходимо подтвердить согласие.";
    }

    if (contactMethod === "telegram" && consultation.telegramUsername !== undefined) {
      const telegramUsername = stringValue(consultation.telegramUsername, 64);
      if (telegramUsername === null) return "Проверьте имя пользователя Telegram.";
    }
  } else {
    const feedback = payload as FeedbackPayload;
    const contact = stringValue(feedback.contact, 160);
    if (!contact || (!contact.includes("@") && normalizePhone(contact).length < 11)) return "Проверьте контакт для ответа.";
    if (!stringValue(feedback.message, 2_000)) return "Проверьте сообщение.";
    if (!isBooleanTrue(feedback.personalDataConsent) || !isBooleanTrue(feedback.privacyPolicyConsent)) {
      return "Необходимо подтвердить согласие.";
    }
  }

  return null;
}

async function verifySmartCaptcha(request: Request, payload: CommonFormPayload): Promise<void> {
  const enabled = process.env.SMARTCAPTCHA_ENABLED === "true"
    || (process.env.NODE_ENV === "production" && process.env.SMARTCAPTCHA_ENABLED !== "false");
  if (!enabled) return;

  const serverKey = process.env.SMARTCAPTCHA_SERVER_KEY?.trim();
  const token = stringValue(payload.captchaToken, 8_192);
  if (!serverKey) throw new FormProtectionError(503, "Защита формы временно недоступна.");
  if (!token) throw new FormProtectionError(400, "Подтвердите, что вы не робот.");

  const params = new URLSearchParams({ secret: serverKey, token });
  const clientIp = getClientIp(request);
  if (clientIp) params.set("ip", clientIp);

  let response: Response;
  try {
    response = await fetch("https://smartcaptcha.cloud.yandex.ru/validate", {
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      signal: AbortSignal.timeout(3_000),
    });
  } catch {
    throw new FormProtectionError(503, "Проверка безопасности временно недоступна.");
  }

  if (!response.ok) throw new FormProtectionError(503, "Проверка безопасности временно недоступна.");

  const result = await response.json() as { status?: string };
  if (result.status !== "ok") throw new FormProtectionError(400, "Подтвердите, что вы не робот.");
}

function formatConsultationMessage(payload: ConsultationPayload): string {
  const lines = [
    "Новая локальная заявка на консультацию",
    "",
    `Имя: ${stringValue(payload.name, 100) ?? "—"}`,
    `Телефон: ${stringValue(payload.phone, 32) ?? "—"}`,
    `Формат: ${String(payload.consultationFormat)}`,
    `Способ связи: ${String(payload.contactMethod)}`,
  ];

  if (payload.contactMethod === "telegram") {
    lines.push(`Telegram: ${stringValue(payload.telegramUsername, 64) ?? "—"}`);
  }

  return lines.join("\n");
}

function formatFeedbackMessage(payload: FeedbackPayload): string {
  return [
    "Новое локальное сообщение с сайта",
    "",
    `Имя: ${stringValue(payload.name, 100) ?? "—"}`,
    `Контакт: ${stringValue(payload.contact, 160) ?? "—"}`,
    "",
    "Сообщение:",
    stringValue(payload.message, 2_000) ?? "—",
  ].join("\n");
}

function isRetryableDeliveryStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function getRequestTimeoutMs(value: string | undefined, fallback: number): number {
  const timeoutMs = Number(value);
  return Number.isFinite(timeoutMs) && timeoutMs >= 1_000 && timeoutMs <= 30_000 ? timeoutMs : fallback;
}

async function fetchWithDeliveryRetry(
  url: string,
  init: Omit<RequestInit, "signal">,
  timeoutMs: number,
): Promise<Response> {
  let lastResponse: Response | undefined;

  for (let attempt = 0; attempt < DELIVERY_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!isRetryableDeliveryStatus(response.status) || attempt === DELIVERY_MAX_ATTEMPTS - 1) {
        return response;
      }

      await response.body?.cancel();
      lastResponse = response;
    } catch (error) {
      if (attempt === DELIVERY_MAX_ATTEMPTS - 1) throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, DELIVERY_RETRY_DELAYS_MS[attempt] ?? 750));
  }

  return lastResponse ?? new Response(null, { status: 503 });
}

async function sendToMailpit(message: MailpitMessage): Promise<void> {
  const mailpitUrl = (process.env.MAILPIT_URL || "http://127.0.0.1:8025").replace(/\/$/, "");
  const response = await fetchWithDeliveryRetry(`${mailpitUrl}/api/v1/send`, {
    body: JSON.stringify(message),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  }, 3_000);

  if (!response.ok) throw new Error("Mailpit rejected the message.");
}

async function sendToAmo(request: Request, kind: FormKind, payload: AmoFormPayload): Promise<void> {
  const proxyUrl = process.env.AMO_PROXY_URL?.trim();
  const code = process.env.AMO_CODE?.trim();

  if (process.env.AMO_ENABLED !== "true" || !proxyUrl || !code) {
    throw new Error("amoCRM delivery is not configured.");
  }

  const requestUrl = new URL(request.url);
  const params = new URLSearchParams({
    code,
    domain: requestUrl.hostname,
    formName: kind,
    name: payload.name,
    page: `${requestUrl.pathname}${requestUrl.search}`,
    pipeline_id: process.env.AMO_PIPELINE_ID || "5284933",
    status_id: process.env.AMO_STATUS_ID || "47117170",
  });

  if (payload.phone) params.set("phone", normalizePhone(payload.phone));
  if (payload.contact?.includes("@")) params.set("email", payload.contact);
  if (payload.contact && !payload.contact.includes("@")) params.set("phone", normalizePhone(payload.contact));
  if (payload.contactMethod) params.set("contactMethod", payload.contactMethod);
  if (payload.consultationFormat) params.set("consultationFormat", payload.consultationFormat);
  if (payload.message) params.set("message", payload.message);

  const referrer = getCookie(request, "referrer") || request.headers.get("referer");
  if (referrer) params.set("referrer", referrer);

  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) {
    const value = getCookie(request, key);
    if (value) params.set(key, value);
  }

  const response = await fetchWithDeliveryRetry(proxyUrl, {
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
  }, getRequestTimeoutMs(process.env.AMO_REQUEST_TIMEOUT_MS, 8_000));

  if (!response.ok) throw new Error(`amoCRM proxy returned ${response.status}.`);
}

export async function handleFormSubmission(request: Request, kind: FormKind): Promise<Response> {
  if (request.method !== "POST") return jsonResponse({ error: "Метод не поддерживается." }, 405);
  if (!hasAllowedOrigin(request)) return jsonResponse({ error: "Запрос отклонён." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ error: "Ожидается JSON-запрос." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ error: "Запрос слишком большой." }, 413);
  }

  let payload: ConsultationPayload | FeedbackPayload;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).length > MAX_REQUEST_BYTES) {
      return jsonResponse({ error: "Запрос слишком большой." }, 413);
    }
    const parsed = JSON.parse(body) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return jsonResponse({ error: "Некорректное тело запроса." }, 400);
    }
    payload = parsed as ConsultationPayload | FeedbackPayload;
  } catch {
    return jsonResponse({ error: "Некорректное тело запроса." }, 400);
  }

  if (typeof payload.website === "string" && payload.website.trim()) {
    return jsonResponse({ ok: true });
  }

  const validationError = getFormError(kind, payload);
  if (validationError) return jsonResponse({ error: validationError }, 400);

  try {
    await verifySmartCaptcha(request, payload);
  } catch (error) {
    if (error instanceof FormProtectionError) return jsonResponse({ error: error.message }, error.status);
    return jsonResponse({ error: "Проверка безопасности временно недоступна." }, 503);
  }

  if (isRateLimited(getClientKey(request, kind))) {
    return jsonResponse({ error: "Слишком много попыток. Попробуйте позже." }, 429);
  }

  const idempotencyKey = getIdempotencyKey(request, payload);
  if (payload.idempotencyKey !== undefined && !idempotencyKey) {
    return jsonResponse({ error: "Некорректный идентификатор запроса." }, 400);
  }

  if (idempotencyKey) {
    const reservation = reserveIdempotency(idempotencyKey, kind);
    if (reservation === "duplicate") return jsonResponse({ duplicate: true, ok: true });
    if (reservation === "processing") return jsonResponse({ error: "Заявка уже обрабатывается." }, 409);
  }

  const isConsultation = kind === "consultation";
  const deliveryMode = process.env.FORM_DELIVERY_MODE || (process.env.NODE_ENV === "development" ? "mailpit" : "disabled");

  try {
    if (deliveryMode === "mailpit") {
      const message: MailpitMessage = {
        From: {
          Email: process.env.MAILPIT_FROM || "drkav-local@example.invalid",
          Name: "drkav — локальная разработка",
        },
        Subject: isConsultation ? "drkav: заявка на консультацию" : "drkav: сообщение с сайта",
        Text: isConsultation
          ? formatConsultationMessage(payload as ConsultationPayload)
          : formatFeedbackMessage(payload as FeedbackPayload),
        To: [{ Email: process.env.MAILPIT_TO || "qa@example.invalid", Name: "Локальный тестовый inbox" }],
      };
      await sendToMailpit(message);
    } else if (deliveryMode === "amo") {
      const consultation = payload as ConsultationPayload;
      const feedback = payload as FeedbackPayload;
      await sendToAmo(request, kind, {
        contact: stringValue(feedback.contact, 160) ?? undefined,
        contactMethod: String(consultation.contactMethod ?? ""),
        consultationFormat: String(consultation.consultationFormat ?? ""),
        message: stringValue(feedback.message, 2_000) ?? undefined,
        name: stringValue(payload.name, 100) ?? "Клиент",
        phone: stringValue(consultation.phone, 32) ?? undefined,
      });
    } else {
      throw new Error("Form delivery is not configured.");
    }
  } catch {
    if (idempotencyKey) releaseIdempotency(idempotencyKey, kind);
    return jsonResponse({ error: "Не удалось передать заявку. Попробуйте ещё раз позже." }, 503);
  }

  if (idempotencyKey) completeIdempotency(idempotencyKey, kind);

  return jsonResponse({ ok: true });
}
