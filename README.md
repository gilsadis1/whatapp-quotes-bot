# Hebrew WhatsApp Daily Quotes

A small production-ready TypeScript (Node.js) project that sends a daily WhatsApp message with an inspirational quote. It selects a quote, generates a kid-friendly bio and optional reflection question via OpenAI, and sends it through the WhatsApp Cloud API. It also logs what was sent to avoid repeats.

## Features
- Daily scheduled run (GitHub Actions)
- Static quotes dataset (25+ quotes)
- OpenAI-powered translation + curiosity bio
- WhatsApp Cloud API delivery
- Configurable content language (phase 1)
- Wikipedia link in the configured language when available (falls back to English)
- Simple repeat-avoidance log
- Minimal tests

## Repo Structure
```
/src
  /quotes
    quotes.ts
  /services
    openai.ts
    whatsapp.ts
    wikipedia.ts
  /core
    selector.ts
    messageBuilder.ts
    storage.ts
  main.ts
/data
  sent.json
/tests
  selector.test.ts
  messageBuilder.test.ts
.github/workflows/daily.yml
.env.example
README.md
package.json
tsconfig.json
```

## Requirements
- Node.js 20+
- npm

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example` and fill in values.
3. Run locally:
   ```bash
   npm run dev
   ```

## Environment Variables
See `.env.example`:
- `OPENAI_API_KEY` (required)
- `OPENAI_MODEL` (optional, default: `gpt-4o-mini`)
- `WHATSAPP_ACCESS_TOKEN` (required)
- `WHATSAPP_PHONE_NUMBER_ID` (required)
- `WHATSAPP_TO_PHONE` (required)
- `MIN_DAYS_BETWEEN_REPEATS` (optional, default 90)
- `INCLUDE_REFLECTION_QUESTION` (optional, default false)
- `DRY_RUN` (optional, default false). When true, prints the message and does not send or log.
- `CONTENT_LANGUAGE` (optional, default `he`)
- `WIKIPEDIA_LANG` (optional, default `he`; falls back to English if not found)
- `READ_MORE_TEXT` (optional override for the “read more” line)
- `QUESTION_PREFIX` (optional override for the reflection question prefix)
- `FORCE_QUOTE_ID` (optional, force a specific quote for testing)
- `FORCE_AUTHOR` (optional, force a specific author for testing; exact English name match)

## WhatsApp Cloud API (High-Level)
1. Create a Meta App and enable WhatsApp Cloud API.
2. Add and verify a phone number in the WhatsApp Cloud API dashboard.
3. Generate a permanent access token (or a long-lived token) with permissions.
4. Use the provided `phone_number_id` and your target `to` phone number in env vars.

## OpenAI Usage
The app uses OpenAI to:
- Translate the quote
- Produce 2–3 short kid-friendly curiosity sentences
- Optionally add a reflection question

The prompt instructs the model to output only JSON, avoid inventing facts, and follow gendered grammar where applicable.

## GitHub Actions Schedule
The workflow in `.github/workflows/daily.yml` runs at **12:00 UTC** daily.
- This corresponds to **14:00 Asia/Jerusalem** during standard time.
- It may drift by 1 hour during daylight saving time (DST).

### Required GitHub Secrets
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional)
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_TO_PHONE`
- `MIN_DAYS_BETWEEN_REPEATS` (optional)
- `INCLUDE_REFLECTION_QUESTION` (optional)
- `DRY_RUN` (optional)
- `CONTENT_LANGUAGE` (optional)
- `WIKIPEDIA_LANG` (optional)
- `READ_MORE_TEXT` (optional)
- `QUESTION_PREFIX` (optional)

## Adding More Quotes
Edit `src/quotes/quotes.ts` and append items to `QUOTES`. Each item needs:
- `id`
- `author` (English)
- `gender` (`male` | `female` | `other`)
- `quote_en`
- `wikipedia` (full URL)
- `tags`

## Notes
- Dates in `data/sent.json` use UTC `YYYY-MM-DD` format.
- `.env` is intentionally git-ignored. Do not commit real keys.
- `data/sent.json` is git-ignored to avoid leaking usage history when publishing.
