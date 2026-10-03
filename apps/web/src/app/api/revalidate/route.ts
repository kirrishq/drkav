import { revalidatePath, revalidateTag } from "next/cache";

function getSafePath(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("/") || value.includes("?") || value.includes("#")) {
    return undefined;
  }

  return `/${value.split("/").filter(Boolean).join("/")}`.replace(/\/$/, "") || "/";
}

export async function POST(request: Request) {
  const expectedSecret = process.env.REVALIDATE_SECRET?.trim();
  const receivedSecret = request.headers.get("x-revalidate-secret")?.trim();

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    payload = undefined;
  }

  const body = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
  const entry = body.entry && typeof body.entry === "object" ? body.entry as Record<string, unknown> : {};
  const data = body.data && typeof body.data === "object" ? body.data as Record<string, unknown> : {};
  const changedPath = getSafePath(
    request.headers.get("x-cms-path") ??
      body.path ??
      entry.canonicalPath ??
      data.canonicalPath,
  );

  // Every CMS request carries the shared tag, so any published CMS entry can
  // invalidate the relevant cached response without knowing its collection.
  revalidateTag("cms");
  revalidateTag("promotions");
  revalidatePath("/akcii");

  if (changedPath) {
    revalidatePath(changedPath);
  }

  return Response.json({ revalidated: true, path: changedPath ?? null });
}
