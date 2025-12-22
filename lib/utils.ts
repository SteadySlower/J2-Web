import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseToEmptyOkurigana(input: string): string {
  const kanjiRegex = /([\u4E00-\u9FFF]+)/g;
  return input.replace(kanjiRegex, (match) => {
    return `${match}{???}`;
  });
}

export function containsKanji(input: string): boolean {
  const kanjiRegex = /[\u4E00-\u9FFF]/;
  return kanjiRegex.test(input);
}
