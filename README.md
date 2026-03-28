# Hebrew WhatsApp Daily Quotes

A small production-ready TypeScript (Node.js) project that sends a daily WhatsApp message with an inspirational quote. It selects a quote, generates a kid-friendly bio and optional reflection question via OpenAI, and sends it via Twilio WhatsApp (Sandbox or production sender). It also logs what was sent to avoid repeats.

## Features
- Daily scheduled run (GitHub Actions)
- Static quotes dataset (25+ quotes)
- OpenAI-powered translation + curiosity bio
- Twilio WhatsApp delivery (single recipient)
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
- `TWILIO_ACCOUNT_SID` (required)
- `TWILIO_AUTH_TOKEN` (required)
- `TWILIO_WHATSAPP_FROM` (required, example `whatsapp:+14155238886` for sandbox)
- `TWILIO_WHATSAPP_TO` (required, example `whatsapp:+9725XXXXXXXX`)
- `MIN_DAYS_BETWEEN_REPEATS` (optional, default 90)
- `INCLUDE_REFLECTION_QUESTION` (optional, default false)
- `DRY_RUN` (optional, default false). When true, prints the message and does not send or log.
- `CONTENT_LANGUAGE` (optional, default `he`)
- `WIKIPEDIA_LANG` (optional, default `he`; falls back to English if not found)
- `READ_MORE_TEXT` (optional override for the “read more” line)
- `QUESTION_PREFIX` (optional override for the reflection question prefix)
- `FORCE_QUOTE_ID` (optional, force a specific quote for testing)
- `FORCE_AUTHOR` (optional, force a specific author for testing; exact English name match)

## Twilio WhatsApp Sandbox Setup
1. In Twilio Console, open WhatsApp Sandbox:
   [Twilio Sandbox](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
2. Copy the sandbox number (usually `+14155238886`) and join code.
3. From your WhatsApp app, send the join code message once to the sandbox number.
4. Set env vars:
   - `TWILIO_WHATSAPP_FROM=whatsapp:+14155238886`
   - `TWILIO_WHATSAPP_TO=whatsapp:+<your_number>`
5. Run the bot. It sends to your single phone number; you can forward manually to your family group.

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
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `TWILIO_WHATSAPP_TO`
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
