import "dotenv/config";

function parseBool(value: string | undefined): boolean {
  if (!value) return false;
  return ["1", "true", "yes", "y"].includes(value.toLowerCase());
}

function requireVars(names: string[]): string[] {
  return names.filter((name) => !(process.env[name] || "").trim());
}

function validateEmail(value: string | undefined): boolean {
  return !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function main(): void {
  const dryRun = parseBool(process.env.DRY_RUN);
  const missing = requireVars([
    "OPENAI_API_KEY",
    "CONTENT_LANGUAGE",
    "WIKIPEDIA_LANG",
    "MIN_DAYS_BETWEEN_REPEATS",
    "INCLUDE_REFLECTION_QUESTION"
  ]);

  if (!dryRun) {
    missing.push(
      ...requireVars([
        "SMTP_HOST",
        "SMTP_USER",
        "SMTP_PASS",
        "EMAIL_TO"
      ])
    );
  }

  const uniqueMissing = [...new Set(missing)];
  const badValues: string[] = [];

  if (!dryRun) {
    const from = (process.env.EMAIL_FROM || "").trim() || process.env.SMTP_USER;
    if (!validateEmail(from)) {
      badValues.push("EMAIL_FROM must be a valid email address");
    }
    if (!validateEmail(process.env.EMAIL_TO)) {
      badValues.push("EMAIL_TO must be a valid email address");
    }
  }

  const port = Number(process.env.SMTP_PORT || "587");
  if (!Number.isInteger(port) || port <= 0) {
    badValues.push("SMTP_PORT must be a positive integer");
  }

  if (uniqueMissing.length === 0 && badValues.length === 0) {
    console.log("Config check passed.");
    console.log(`DRY_RUN=${dryRun ? "true" : "false"}`);
    process.exit(0);
  }

  if (uniqueMissing.length > 0) {
    console.error("Missing required environment variables:");
    for (const name of uniqueMissing) {
      console.error(`- ${name}`);
    }
  }

  if (badValues.length > 0) {
    console.error("Invalid configuration values:");
    for (const value of badValues) {
      console.error(`- ${value}`);
    }
  }

  process.exit(1);
}

main();
