import { describe, it, expect } from "vitest";
import { buildMessage } from "../src/core/messageBuilder";

describe("buildMessage", () => {
  it("includes quote, author, and link", () => {
    const message = buildMessage({
      quoteHe: "זה ציטוט",
      authorHe: "שם",
      bioLines: ["שורה אחת", "שורה שתיים"],
      wikipediaUrl: "https://example.com",
      gender: "female",
      readMoreText: "רוצים לקרוא עליה עוד?",
      questionPrefix: "שאלת היום:"
    });

    expect(message).toContain("\"זה ציטוט\" – שם");
    expect(message).toContain("https://example.com");
    expect(message).toContain("רוצים לקרוא עליה עוד?");
  });
});
