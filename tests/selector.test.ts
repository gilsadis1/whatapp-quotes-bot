import { describe, it, expect } from "vitest";
import { selectQuote } from "../src/core/selector";
import type { QuoteItem } from "../src/quotes/quotes";
import type { SentEntry } from "../src/core/storage";

const quotes: QuoteItem[] = [
  {
    id: "q1",
    author: "Author One",
    gender: "male",
    quote_en: "Quote one",
    wikipedia: "https://example.com/1",
    tags: ["sports"]
  },
  {
    id: "q2",
    author: "Author Two",
    gender: "female",
    quote_en: "Quote two",
    wikipedia: "https://example.com/2",
    tags: ["sports"]
  }
];

describe("selectQuote", () => {
  it("prefers quotes that were never used", () => {
    const sentLog: SentEntry[] = [
      { date: "2026-02-01", quoteId: "q1" }
    ];
    const now = new Date("2026-02-08T12:00:00Z");
    const result = selectQuote(quotes, sentLog, 90, now);
    expect(result.quote.id).toBe("q2");
    expect(result.reused).toBe(false);
  });

  it("avoids recently used quotes", () => {
    const sentLog: SentEntry[] = [
      { date: "2025-10-01", quoteId: "q1" },
      { date: "2026-02-01", quoteId: "q2" }
    ];
    const now = new Date("2026-02-08T12:00:00Z");
    const result = selectQuote(quotes, sentLog, 90, now);
    expect(result.quote.id).toBe("q1");
    expect(result.reused).toBe(false);
  });
});
