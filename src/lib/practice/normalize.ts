export function normalizeAnswer(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/;$/, "")
    .trim();
}

export function answersMatch(input: string, answers: string[]): boolean {
  const normalizedInput = normalizeAnswer(input);
  return answers.some((answer) => normalizeAnswer(answer) === normalizedInput);
}
