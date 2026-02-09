import type { QuoteItem } from "../quotes/quotes";
import type { SentEntry } from "./storage";

export type SelectionResult = {
  quote: QuoteItem;
  reused: boolean;
};

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(a.getTime() - b.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function selectQuote(
  quotes: QuoteItem[],
  sentLog: SentEntry[],
  minDaysBetween: number,
  now: Date = new Date()
): SelectionResult {
  if (quotes.length === 0) {
    throw new Error("No quotes available");
  }

  const nowDateStr = toDateOnly(now);
  const recentQuoteIds = new Set<string>();

  for (const entry of sentLog) {
    if (!entry.date || !entry.quoteId) continue;
    const entryDate = new Date(entry.date + "T00:00:00Z");
    const nowDate = new Date(nowDateStr + "T00:00:00Z");
    const diff = daysBetween(entryDate, nowDate);
    if (diff >= 0 && diff < minDaysBetween) {
      recentQuoteIds.add(entry.quoteId);
    }
  }

  const fresh = quotes.filter((q) => !recentQuoteIds.has(q.id));
  if (fresh.length > 0) {
    const quote = fresh[Math.floor(Math.random() * fresh.length)];
    return { quote, reused: false };
  }

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return { quote, reused: true };
}
