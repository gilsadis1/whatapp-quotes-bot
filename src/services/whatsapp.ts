import twilio from "twilio";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function isTransientTwilioError(err: unknown): boolean {
  const code = Number((err as { code?: number })?.code);
  if (!Number.isNaN(code) && [20429, 20500, 20503].includes(code)) {
    return true;
  }

  const status = Number((err as { status?: number })?.status);
  if (!Number.isNaN(status) && status >= 500) {
    return true;
  }

  return false;
}

export async function sendWhatsAppMessage(text: string): Promise<void> {
  const accountSid = getEnv("TWILIO_ACCOUNT_SID");
  const authToken = getEnv("TWILIO_AUTH_TOKEN");
  const from = getEnv("TWILIO_WHATSAPP_FROM");
  const to = getEnv("TWILIO_WHATSAPP_TO");

  const client = twilio(accountSid, authToken);
  let lastError: unknown;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const result = await client.messages.create({
        from,
        to,
        body: text
      });
      console.log(`Twilio message queued: ${result.sid}`);
      return;
    } catch (err: unknown) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      const code = (err as { code?: number })?.code;
      const message = (err as { message?: string })?.message || "Unknown Twilio error";
      console.error(
        `Twilio send attempt ${attempt} failed: status=${String(status)} code=${String(code)} message=${message}`
      );

      if (attempt >= 2 || !isTransientTwilioError(err)) {
        break;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Twilio WhatsApp send failed");
}
