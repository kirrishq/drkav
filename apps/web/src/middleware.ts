import { NextRequest, NextResponse } from "next/server";

type RateLimitKind = "api" | "page";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_PAGE_LIMIT = 180;
const DEFAULT_API_LIMIT = 30;
const MAX_TRACKED_CLIENTS = 10_000;

const rateLimitStore = new Map<string, RateLimitEntry>();
let lastCleanupAt = 0;

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getWindowMs(): number {
  return positiveInteger(process.env.WEB_RATE_LIMIT_WINDOW_MS, DEFAULT_WINDOW_MS);
}

function getLimit(kind: RateLimitKind): number {
  return positiveInteger(
    kind === "api" ? process.env.WEB_RATE_LIMIT_API_MAX : process.env.WEB_RATE_LIMIT_PAGE_MAX,
    kind === "api" ? DEFAULT_API_LIMIT : DEFAULT_PAGE_LIMIT,
  );
}

function cleanupRateLimitStore(now: number, windowMs: number): void {
  if (now - lastCleanupAt < windowMs) return;

  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) rateLimitStore.delete(key);
  }

  while (rateLimitStore.size > MAX_TRACKED_CLIENTS) {
    const oldestKey = rateLimitStore.keys().next().value;
    if (typeof oldestKey !== "string") break;
    rateLimitStore.delete(oldestKey);
  }

  lastCleanupAt = now;
}

function getClientIp(request: NextRequest): string {
  if (process.env.TRUST_PROXY_HEADERS !== "true") return "unknown";

  return request.headers.get("x-real-ip")?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}

function isRateLimited(request: NextRequest, kind: RateLimitKind): boolean {
  const now = Date.now();
  const windowMs = getWindowMs();
  const key = `${kind}:${getClientIp(request)}`;
  const limit = getLimit(kind);

  cleanupRateLimitStore(now, windowMs);

  const existing = rateLimitStore.get(key);
  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  existing.count += 1;
  return existing.count > limit;
}

function isStaticAsset(pathname: string): boolean {
  return pathname.startsWith("/_next/static/")
    || pathname.startsWith("/_next/image")
    || pathname === "/favicon.ico"
    || pathname === "/icon.png"
    || pathname === "/robots.txt"
    || pathname === "/sitemap.xml"
    || /\.(?:avif|css|gif|ico|jpe?g|js|map|png|svg|webp|woff2?)$/i.test(pathname);
}

function isKnownScannerPath(pathname: string): boolean {
  return [
    "/.env",
    "/.git",
    "/cgi-bin",
    "/phpmyadmin",
    "/server-status",
    "/vendor/phpunit",
    "/wp-admin",
    "/wp-login.php",
    "/xmlrpc.php",
  ].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}?`));
}

function tooManyRequestsResponse(): NextResponse {
  return new NextResponse("Слишком много запросов. Повторите попытку позже.", {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "Retry-After": "60",
    },
    status: 429,
  });
}

export function middleware(request: NextRequest): NextResponse {
  if (process.env.NODE_ENV !== "production" || process.env.WEB_RATE_LIMIT_ENABLED === "false") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (isKnownScannerPath(pathname)) {
    return new NextResponse("Not Found", {
      headers: { "Cache-Control": "no-store" },
      status: 404,
    });
  }

  if (isStaticAsset(pathname)) return NextResponse.next();

  if (!["GET", "HEAD", "OPTIONS", "POST"].includes(request.method)) {
    return new NextResponse("Method Not Allowed", {
      headers: { Allow: "GET, HEAD, OPTIONS, POST", "Cache-Control": "no-store" },
      status: 405,
    });
  }

  const kind: RateLimitKind = pathname.startsWith("/api/") ? "api" : "page";
  return isRateLimited(request, kind) ? tooManyRequestsResponse() : NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
