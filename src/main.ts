import "dotenv/config";
import { QUOTES } from "./quotes/quotes";
import { readSentLog, appendSentLog } from "./core/storage";
import { selectQuote } from "./core/selector";
import { buildMessage } from "./core/messageBuilder";
import { fetchWikipediaSummary, resolveWikipediaUrl } from "./services/wikipedia";
import { generateLocalizedContent } from "./services/openai";
import { sendWhatsAppMessage } from "./services/whatsapp";

function parseBool(value: string | undefined): boolean {
  if (!value) return false;
  return ["1", "true", "yes", "y"].includes(value.toLowerCase());
}

function getContentLanguage(): string {
  return (process.env.CONTENT_LANGUAGE || "he").trim().toLowerCase();
}

function getWikipediaLanguage(): string {
  return (process.env.WIKIPEDIA_LANG || getContentLanguage()).trim().toLowerCase();
}

function findForcedQuote() {
  const forcedId = (process.env.FORCE_QUOTE_ID || "").trim();
  const forcedAuthor = (process.env.FORCE_AUTHOR || "").trim().toLowerCase();

  if (forcedId) {
    return QUOTES.find((q) => q.id === forcedId);
  }
  if (forcedAuthor) {
    return QUOTES.find((q) => q.author.toLowerCase() === forcedAuthor);
  }
  return undefined;
}

function defaultReadMoreText(language: string, gender?: "female" | "male" | "other"): string {
  if (language === "he") {
    if (gender === "female") return "רוצים לקרוא עליה עוד?";
    if (gender === "male") return "רוצים לקרוא עליו עוד?";
    return "רוצים לקרוא עליו עוד?";
  }

  return "Want to read more?";
}

function defaultQuestionPrefix(language: string): string {
  if (language === "he") return "שאלת היום:";
  return "Question of the day:";
}

async function run(): Promise<void> {
  const minDays = Number(process.env.MIN_DAYS_BETWEEN_REPEATS || "90");
  const includeReflection = parseBool(process.env.INCLUDE_REFLECTION_QUESTION);
  const dryRun = parseBool(process.env.DRY_RUN);
  const contentLanguage = getContentLanguage();
  const wikipediaLang = getWikipediaLanguage();
  const readMoreOverride = (process.env.READ_MORE_TEXT || "").trim();
  const questionPrefix = (process.env.QUESTION_PREFIX || "").trim();

  console.log("Loading sent log...");
  const sentLog = await readSentLog();

  const forced = findForcedQuote();
  console.log("Selecting quote...");
  const selection = forced
    ? { quote: forced, reused: false }
    : selectQuote(QUOTES, sentLog, minDays);
  console.log(`Selected: ${selection.quote.author} (${selection.quote.id})`);

  console.log("Fetching Wikipedia summary...");
  const wikiSummary = await fetchWikipediaSummary(selection.quote.author);

  console.log("Resolving Wikipedia URL...");
  const wikiUrl = await resolveWikipediaUrl(
    selection.quote.wikipedia,
    selection.quote.author,
    wikipediaLang
  );

  console.log("Generating content via OpenAI...");
  const generated = await generateLocalizedContent(
    selection.quote,
    wikiSummary,
    includeReflection,
    contentLanguage
  );

  const readMoreText =
    readMoreOverride || defaultReadMoreText(contentLanguage, selection.quote.gender);
  const questionPrefixText = questionPrefix || defaultQuestionPrefix(contentLanguage);

  const message = buildMessage({
    quoteHe: generated.quoteHe,
    authorHe: generated.authorHe,
    bioLines: generated.bioLines,
    wikipediaUrl: wikiUrl,
    reflectionQuestion: generated.reflectionQuestion,
    gender: selection.quote.gender,
    readMoreText,
    questionPrefix: questionPrefixText
  });

  if (dryRun) {
    console.log("Dry run enabled. Message not sent.");
    console.log("--- MESSAGE START ---");
    console.log(message);
    console.log("--- MESSAGE END ---");
    return;
  }

  console.log("Sending WhatsApp message...");
  await sendWhatsAppMessage(message);

  const today = new Date().toISOString().slice(0, 10);
  await appendSentLog({ date: today, quoteId: selection.quote.id });

  console.log("Done.");
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
