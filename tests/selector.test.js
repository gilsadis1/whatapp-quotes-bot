"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const selector_1 = require("../src/core/selector");
const quotes = [
    {
        id: "q1",
        author: "Author One",
        quote_en: "Quote one",
        wikipedia: "https://example.com/1",
        tags: ["sports"]
    },
    {
        id: "q2",
        author: "Author Two",
        quote_en: "Quote two",
        wikipedia: "https://example.com/2",
        tags: ["sports"]
    }
];
(0, vitest_1.describe)("selectQuote", () => {
    (0, vitest_1.it)("avoids recently used quotes", () => {
        const sentLog = [
            { date: "2026-02-01", quoteId: "q1" }
        ];
        const now = new Date("2026-02-08T12:00:00Z");
        const result = (0, selector_1.selectQuote)(quotes, sentLog, 90, now);
        (0, vitest_1.expect)(result.quote.id).toBe("q2");
        (0, vitest_1.expect)(result.reused).toBe(false);
    });
});
