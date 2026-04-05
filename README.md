# Daily Inspiration Quote

`Daily Inspiration Quote` sends one daily inspirational message by email. It picks a quote, translates it into Hebrew, adds a short kid-friendly bio, includes a Wikipedia link, and sends the result to a single email address.

The project is designed for one personal recipient first. You can forward the email wherever you want after it arrives.

## Who this is for
This repo is best for people who are comfortable with:
- editing a `.env` file
- creating API keys and app passwords
- optionally using GitHub Actions for daily automation

If that sounds like you, setup is straightforward.

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example`.
3. Fill in:
   - `OPENAI_API_KEY`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `EMAIL_FROM`
   - `EMAIL_TO`
4. Check your config:
   ```bash
   npm run check-config
   ```
5. Try a dry run:
   ```bash
   DRY_RUN=true npm start
   ```
6. Send a real email:
   ```bash
   DRY_RUN=false npm start
   ```

## Local Use
You do not need GitHub Actions to use this project.

You can run it manually whenever you want:
```bash
npm start
```

Or schedule it locally with `cron`, `launchd`, or any scheduler you already use.

## GitHub Actions Use
If you want GitHub to run it every day:
1. Push the repo to your own GitHub account.
2. Add the required repository secrets.
3. Run the workflow manually once to confirm delivery.
4. Leave the schedule enabled.
The workflow lives in `.github/workflows/daily.yml`.

## SMTP Setup
This project uses SMTP because it is simple and reliable for personal automation.

Example Gmail setup:
1. Turn on 2-Step Verification in your Google account.
2. Generate an app password.
3. Use:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_SECURE=false`
   - `SMTP_USER=your_email@gmail.com`
   - `SMTP_PASS=your_gmail_app_password`
   - `EMAIL_FROM=your_email@gmail.com`
   - `EMAIL_TO=your_email@gmail.com`

## Environment Variables
See `.env.example`.

Required for normal sending:
- `OPENAI_API_KEY`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_TO`
- `EMAIL_FROM` if you want it to be different from `SMTP_USER`

Common optional values:
- `OPENAI_MODEL`
- `EMAIL_FROM_NAME`
- `EMAIL_SUBJECT`
- `MIN_DAYS_BETWEEN_REPEATS`
- `INCLUDE_REFLECTION_QUESTION`
- `DRY_RUN`
- `CONTENT_LANGUAGE`
- `WIKIPEDIA_LANG`
- `READ_MORE_TEXT`
- `QUESTION_PREFIX`
- `FORCE_QUOTE_ID`
- `FORCE_AUTHOR`

## GitHub Secrets
If you use GitHub Actions, the minimal required repository secrets are:
- `OPENAI_API_KEY`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_TO`

Optional secrets:
- `EMAIL_FROM`
- `EMAIL_SUBJECT`

The workflow already provides sensible defaults for:
- `OPENAI_MODEL=gpt-4o-mini`
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `EMAIL_FROM_NAME=Daily Quote Bot`
- `MIN_DAYS_BETWEEN_REPEATS=90`
- `INCLUDE_REFLECTION_QUESTION=false`
- `DRY_RUN=false`
- `CONTENT_LANGUAGE=he`
- `WIKIPEDIA_LANG=he`

If you want to customize those later, you can edit `.github/workflows/daily.yml` or extend the workflow to use repository variables.

## Helpful Commands
Install dependencies:
```bash
npm install
```

Validate setup:
```bash
npm run check-config
```

Run tests:
```bash
npm test
```

Build:
```bash
npm run build
```

Dry run:
```bash
DRY_RUN=true npm start
```

Real send:
```bash
DRY_RUN=false npm start
```

## Project Structure
```text
/src
  /quotes
    quotes.ts
  /services
    email.ts
    openai.ts
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
```

## Notes
- `.env` is git-ignored. Real credentials should never be committed.
- `data/sent.json` is git-ignored so your send history stays private.
- Dates in `data/sent.json` use UTC `YYYY-MM-DD` format.
