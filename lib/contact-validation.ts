export type ContactInput = {
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
};

export type ContactField =
  | "name"
  | "email"
  | "organization"
  | "subject"
  | "message";

export type ValidationResult =
  | { ok: true; value: ContactInput }
  | {
      ok: false;
      fields: Partial<Record<ContactField, string>>;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | null {
  return typeof value === "string" ? value.normalize("NFKC").trim() : null;
}

export function hasFilledHoneypot(body: unknown): boolean {
  return (
    isRecord(body) &&
    typeof body.website === "string" &&
    body.website.trim().length > 0
  );
}

export function validateContact(body: unknown): ValidationResult {
  if (!isRecord(body)) {
    return {
      ok: false,
      fields: {
        name: "Formulaire invalide.",
        email: "Formulaire invalide.",
        message: "Formulaire invalide."
      }
    };
  }

  const name = text(body.name)?.replace(/\s+/g, " ") ?? "";
  const email = text(body.email)?.toLowerCase() ?? "";
  const organization =
    text(body.organization)?.replace(/\s+/g, " ") ?? "";
  const subject = text(body.subject)?.replace(/\s+/g, " ") ?? "";
  const message = text(body.message)?.replace(/\r\n?/g, "\n") ?? "";
  const fields: Partial<Record<ContactField, string>> = {};

  if (name.length < 2 || name.length > 80) {
    fields.name = "Indiquez un nom entre 2 et 80 caractères.";
  }
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)
  ) {
    fields.email = "Indiquez une adresse e-mail valide.";
  }
  if (organization.length > 100) {
    fields.organization = "Le nom ne doit pas dépasser 100 caractères.";
  }
  if (subject.length > 120) {
    fields.subject = "Le sujet ne doit pas dépasser 120 caractères.";
  }
  if (message.length < 10 || message.length > 3000) {
    fields.message = "Le message doit contenir entre 10 et 3 000 caractères.";
  }

  return Object.keys(fields).length
    ? { ok: false, fields }
    : {
        ok: true,
        value: { name, email, organization, subject, message }
      };
}
