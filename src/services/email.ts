import nodemailer from "nodemailer";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function parsePort(value: string | undefined): number {
  return Number(value || "587");
}

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  return ["1", "true", "yes", "y"].includes(value.toLowerCase());
}

function toHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return [
    "<!doctype html>",
    '<html lang="he" dir="rtl">',
    "<body>",
    '<div style="font-family: Arial, sans-serif; line-height: 1.7; white-space: pre-wrap;">',
    escaped,
    "</div>",
    "</body>",
    "</html>"
  ].join("");
}

function isTransientSmtpError(err: unknown): boolean {
  const code = String((err as { code?: string })?.code || "");
  return ["ECONNECTION", "ETIMEDOUT", "ESOCKET", "ECONNRESET"].includes(code);
}

export async function sendEmailMessage(subject: string, text: string): Promise<void> {
  const host = getEnv("SMTP_HOST");
  const port = parsePort(process.env.SMTP_PORT);
  const secure = parseBool(process.env.SMTP_SECURE, port === 465);
  const user = getEnv("SMTP_USER");
  const pass = getEnv("SMTP_PASS");
  const from = (process.env.EMAIL_FROM || "").trim() || user;
  const to = getEnv("EMAIL_TO");
  const fromName = (process.env.EMAIL_FROM_NAME || "Daily Quote Bot").trim();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });

  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const info = await transporter.sendMail({
        from: `${fromName} <${from}>`,
        to,
        subject,
        text,
        html: toHtml(text)
      });
      console.log(`Email queued: ${info.messageId}`);
      return;
    } catch (err: unknown) {
      lastError = err;
      const code = (err as { code?: string })?.code;
      const message = (err as { message?: string })?.message || "Unknown SMTP error";
      console.error(`Email send attempt ${attempt} failed: code=${String(code)} message=${message}`);
      if (attempt >= 2 || !isTransientSmtpError(err)) {
        break;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("SMTP email send failed");
}
