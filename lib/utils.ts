import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseToEmptyRuby(input: string): string {
  const kanjiRegex = /([\u4E00-\u9FFF]+)/g;
  return input.replace(kanjiRegex, (match) => {
    return `<ruby>${match}<rp>(</rp><rt>???</rt><rp>)</rp></ruby>`;
  });
}
