function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export async function sendWhatsAppMessage(text: string): Promise<void> {
  const accessToken = getEnv("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = getEnv("WHATSAPP_PHONE_NUMBER_ID");
  const toPhone = getEnv("WHATSAPP_TO_PHONE");

  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to: toPhone,
    type: "text",
    text: {
      body: text,
      preview_url: false
    }
  };

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`WhatsApp API error ${res.status}: ${body}`);
      }

      return;
    } catch (err: unknown) {
      lastError = err as Error;
      console.error(`WhatsApp send attempt ${attempt} failed: ${lastError.message}`);
    }
  }

  throw lastError ?? new Error("WhatsApp send failed");
}
