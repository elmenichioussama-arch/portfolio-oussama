import { getD1 } from "@/db";

const WINDOW_SECONDS = 10 * 60;
const RETENTION_SECONDS = 24 * 60 * 60;

type LimitResult = {
  allowed: boolean;
  retryAfter: number;
};

async function digest(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const result = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(result), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

async function consume(
  identity: string,
  scope: string,
  limit: number,
  now: number
): Promise<LimitResult> {
  const db = getD1();
  const windowStart = now - (now % WINDOW_SECONDS);
  const expiresAt = windowStart + RETENTION_SECONDS;
  const bucket = `${scope}:${identity}:${windowStart}`;
  const result = await db
    .prepare(
      `INSERT INTO contact_rate_limits
        (bucket, request_count, window_start, expires_at)
       VALUES (?1, 1, ?2, ?3)
       ON CONFLICT(bucket) DO UPDATE SET
         request_count = request_count + 1,
         expires_at = excluded.expires_at
       RETURNING request_count`
    )
    .bind(bucket, windowStart, expiresAt)
    .run<{ request_count: number }>();

  const count = Number(result.results?.[0]?.request_count ?? limit + 1);
  return {
    allowed: count <= limit,
    retryAfter: Math.max(1, windowStart + WINDOW_SECONDS - now)
  };
}

export async function checkContactRateLimit(
  request: Request,
  email: string
): Promise<LimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const db = getD1();

  await db
    .prepare("DELETE FROM contact_rate_limits WHERE expires_at <= ?1")
    .bind(now)
    .run()
    .catch(() => undefined);

  const clientIp =
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local-preview";

  const [ipHash, senderHash] = await Promise.all([
    digest(clientIp),
    digest(`${clientIp}\u0000${email}`)
  ]);

  const ipLimit = await consume(ipHash, "contact-ip", 20, now);
  if (!ipLimit.allowed) return ipLimit;
  return consume(senderHash, "contact-sender", 5, now);
}
