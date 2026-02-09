export type Gender = "female" | "male" | "other";

export type MessageInput = {
  quoteHe: string;
  authorHe: string;
  bioLines: string[];
  wikipediaUrl: string;
  reflectionQuestion?: string;
  gender?: Gender;
  readMoreText: string;
  questionPrefix: string;
};

function genderedReadMore(gender?: Gender): string {
  if (gender === "female") return "רוצים לקרוא עליה עוד?";
  if (gender === "male") return "רוצים לקרוא עליו עוד?";
  return "רוצים לקרוא עליו עוד?";
}

export function buildMessage(input: MessageInput): string {
  const lines: string[] = [];
  lines.push(`"${input.quoteHe}" – ${input.authorHe}`);

  for (const line of input.bioLines) {
    if (line.trim().length > 0) {
      lines.push(line.trim());
    }
  }

  lines.push(input.readMoreText || genderedReadMore(input.gender));
  lines.push(input.wikipediaUrl);

  if (input.reflectionQuestion && input.reflectionQuestion.trim().length > 0) {
    lines.push(`${input.questionPrefix} ${input.reflectionQuestion.trim()}`);
  }

  return lines.join("\n");
}
