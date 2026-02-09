import type { QuoteItem } from "../quotes/quotes";

export type OpenAIResult = {
  quoteHe: string;
  authorHe: string;
  bioLines: string[];
  reflectionQuestion?: string;
};

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

type OpenAIChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

function safeJsonParse(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Failed to parse OpenAI JSON response");
  }
}

function hasLatin(input: string): boolean {
  return /[A-Za-z]/.test(input);
}

function hasCyrillic(input: string): boolean {
  return /[\u0400-\u04FF]/.test(input);
}

function needsHebrewOnlyCheck(texts: string[]): boolean {
  return texts.some((t) => hasLatin(t) || hasCyrillic(t));
}

function languageLabel(code: string): string {
  const normalized = code.toLowerCase();
  const map: Record<string, string> = {
    he: "Hebrew",
    en: "English",
    es: "Spanish",
    fr: "French",
    ar: "Arabic",
    ru: "Russian",
    de: "German"
  };
  return map[normalized] || `the language code ${code}`;
}

async function callOpenAI(body: Record<string, unknown>): Promise<OpenAIChatResponse> {
  const apiKey = getEnv("OPENAI_API_KEY");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }

  return (await res.json()) as OpenAIChatResponse;
}

async function generateOnce(
  quote: QuoteItem,
  wikiSummary: string | null,
  includeReflection: boolean,
  strictHebrewNames: boolean,
  contentLanguage: string
): Promise<OpenAIResult> {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const langLabel = languageLabel(contentLanguage);

  const systemPrompt =
    `You are a ${langLabel} writing assistant for kids (ages 10-13). ` +
    `Return ONLY valid JSON. Use simple ${langLabel}. No long paragraphs. ` +
    "No exaggerations presented as facts. If unsure, keep it general.";

  const genderHint =
    quote.gender === "female"
      ? "The author is female. Use feminine grammar where applicable."
      : quote.gender === "male"
        ? "The author is male. Use masculine grammar where applicable."
        : "Use gender-neutral grammar when possible.";

  const nameRule =
    contentLanguage.toLowerCase() === "he" && strictHebrewNames
      ? "author_he must be Hebrew-only letters (no Latin or Cyrillic characters)."
      : "If the author's name is not commonly written in the target language, transliterate it.";

  const languageRule =
    contentLanguage.toLowerCase() === "he"
      ? "All output must be in Hebrew only. Do not include Latin or Cyrillic letters anywhere."
      : `All output must be in ${langLabel}. Avoid mixing other languages.`;

  const userPrompt = [
    `Translate the quote to ${langLabel}.`,
    `Create 2-3 short ${langLabel} sentences about the author to spark curiosity for kids.`,
    nameRule,
    genderHint,
    languageRule,
    "Use the Wikipedia summary as grounding context, but do not copy it.",
    "Output JSON with keys: quote_he, author_he, bio_lines (array), reflection_question (string or empty).",
    includeReflection
      ? `Also include a short reflection question in ${langLabel}.`
      : "Set reflection_question to an empty string.",
    "Quote (English): " + quote.quote_en,
    "Author (English): " + quote.author,
    wikiSummary ? "Wikipedia summary: " + wikiSummary : "Wikipedia summary: (not available)"
  ].join("\n");

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.4,
    response_format: { type: "json_object" }
  };

  const data = await callOpenAI(body);
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response missing content");
  }

  const parsed = safeJsonParse(content);

  const quoteHe = String(parsed.quote_he || "").trim();
  const authorHe = String(parsed.author_he || "").trim();
  const bioLines = Array.isArray(parsed.bio_lines)
    ? parsed.bio_lines.map((l: unknown) => String(l).trim()).filter((l: string) => l.length > 0)
    : [];
  const reflectionQuestion = String(parsed.reflection_question || "").trim();

  if (!quoteHe || !authorHe || bioLines.length === 0) {
    throw new Error("OpenAI response missing required fields");
  }

  return {
    quoteHe,
    authorHe,
    bioLines,
    reflectionQuestion: reflectionQuestion || undefined
  };
}

export async function generateLocalizedContent(
  quote: QuoteItem,
  wikiSummary: string | null,
  includeReflection: boolean,
  contentLanguage: string
): Promise<OpenAIResult> {
  const first = await generateOnce(
    quote,
    wikiSummary,
    includeReflection,
    false,
    contentLanguage
  );

  if (
    contentLanguage.toLowerCase() === "he" &&
    needsHebrewOnlyCheck([first.authorHe, first.quoteHe, ...first.bioLines, first.reflectionQuestion || ""])
  ) {
    const retry = await generateOnce(
      quote,
      wikiSummary,
      includeReflection,
      true,
      contentLanguage
    );
    return retry;
  }

  return first;
}
