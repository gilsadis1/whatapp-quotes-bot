"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const messageBuilder_1 = require("../src/core/messageBuilder");
(0, vitest_1.describe)("buildMessage", () => {
    (0, vitest_1.it)("includes quote, author, and link", () => {
        const message = (0, messageBuilder_1.buildMessage)({
            quoteHe: "זה ציטוט",
            authorHe: "שם",
            bioLines: ["שורה אחת", "שורה שתיים"],
            wikipediaUrl: "https://example.com"
        });
        (0, vitest_1.expect)(message).toContain("\"זה ציטוט\" – שם");
        (0, vitest_1.expect)(message).toContain("https://example.com");
    });
});
