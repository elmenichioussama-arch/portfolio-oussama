import { ensureContactSchema, getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { checkContactRateLimit } from "@/lib/contact-rate-limit";
import {
  hasFilledHoneypot,
  validateContact
} from "@/lib/contact-validation";

const MAX_BODY_BYTES = 16 * 1024;
const COMMON_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff"
};

function json(
  body: unknown,
  status: number,
  headers: Record<string, string> = {}
) {
  return Response.json(body, {
    status,
    headers: { ...COMMON_HEADERS, ...headers }
  });
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  if (!isSameOrigin(request)) {
    return json(
      {
        ok: false,
        error: { code: "FORBIDDEN", message: "Requête non autorisée." }
      },
      403
    );
  }

  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return json(
      {
        ok: false,
        error: {
          code: "UNSUPPORTED_MEDIA_TYPE",
          message: "Le formulaire doit être envoyé au format JSON."
        }
      },
      415
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json(
      {
        ok: false,
        error: {
          code: "PAYLOAD_TOO_LARGE",
          message: "Le formulaire est trop volumineux."
        }
      },
      413
    );
  }

  let body: unknown;
  try {
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength > MAX_BODY_BYTES) {
      return json(
        {
          ok: false,
          error: {
            code: "PAYLOAD_TOO_LARGE",
            message: "Le formulaire est trop volumineux."
          }
        },
        413
      );
    }
    body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return json(
      {
        ok: false,
        error: {
          code: "INVALID_JSON",
          message: "Le formulaire envoyé est invalide."
        }
      },
      400
    );
  }

  if (hasFilledHoneypot(body)) {
    return json({ ok: true }, 202);
  }

  const validation = validateContact(body);
  if (!validation.ok) {
    return json(
      {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Vérifiez les champs du formulaire.",
          fields: validation.fields
        }
      },
      422
    );
  }

  try {
    await ensureContactSchema();
    const limit = await checkContactRateLimit(
      request,
      validation.value.email
    );
    if (!limit.allowed) {
      return json(
        {
          ok: false,
          error: {
            code: "RATE_LIMITED",
            message: "Trop de tentatives. Réessayez dans quelques minutes."
          }
        },
        429,
        { "Retry-After": String(limit.retryAfter) }
      );
    }

    await getDb().insert(contactMessages).values({
      id: crypto.randomUUID(),
      ...validation.value
    });

    return json({ ok: true, reference: requestId.slice(0, 8) }, 202);
  } catch (error) {
    console.error("contact_submission_failed", {
      requestId,
      message: error instanceof Error ? error.message : "Unknown error"
    });
    return json(
      {
        ok: false,
        error: {
          code: "SERVER_ERROR",
          message:
            "Le message n'a pas pu être enregistré. Réessayez plus tard.",
          reference: requestId
        }
      },
      500
    );
  }
}
