// Maps article word count to a coffee-size label.
// Espresso (short shot), Cortado (espresso + dash of milk), Lungo (longer pull).

export type CoffeeLabel = "Espresso" | "Cortado" | "Lungo";

export interface CoffeeSize {
  label: CoffeeLabel;
  minutes: number;
  words: number;
}

const WORDS_PER_MIN = 200;

export function wordCount(markdown: string): number {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^---[\s\S]*?---/m, " ")
    .replace(/[#*_>~|]/g, " ")
    .replace(/-{3,}/g, " ");

  return stripped
    .split(/\s+/)
    .filter((token) => /[\p{L}\p{N}]/u.test(token))
    .length;
}

export function coffeeSize(markdown: string): CoffeeSize {
  const words = wordCount(markdown);
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MIN));
  if (words < 150) return { label: "Espresso", minutes, words };
  if (words < 600) return { label: "Cortado", minutes, words };
  return { label: "Lungo", minutes, words };
}
