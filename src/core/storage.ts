import { promises as fs } from "fs";
import path from "path";

export type SentEntry = {
  date: string; // YYYY-MM-DD
  quoteId: string;
};

const DATA_PATH = path.join(process.cwd(), "data", "sent.json");

export async function readSentLog(): Promise<SentEntry[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as SentEntry[];
    }
    return [];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

export async function appendSentLog(entry: SentEntry): Promise<void> {
  const log = await readSentLog();
  log.push(entry);
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(log, null, 2), "utf-8");
}
