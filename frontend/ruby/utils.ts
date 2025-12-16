import type { RubySegment } from "./types";

export function parseRubyString(input: string): RubySegment[] {
  const segments: RubySegment[] = [];
  let currentIndex = 0;

  // okurigana 패턴: 한자{발음}
  const rubyRegex = /([\u4E00-\u9FFF]+)\{([^}]+)\}/g;
  let match;

  while ((match = rubyRegex.exec(input)) !== null) {
    // okurigana 패턴 이전의 일반 텍스트
    if (match.index > currentIndex) {
      const text = input.slice(currentIndex, match.index);
      if (text) {
        // 1글자씩 segment로 추가
        for (const char of text) {
          segments.push({ type: "text", text: char });
        }
      }
    }

    // okurigana 패턴 내용
    segments.push({
      type: "okurigana",
      base: match[1],
      rt: match[2],
    });

    currentIndex = match.index + match[0].length;
  }

  // 남은 일반 텍스트
  if (currentIndex < input.length) {
    const text = input.slice(currentIndex);
    if (text) {
      // 1글자씩 segment로 추가
      for (const char of text) {
        segments.push({ type: "text", text: char });
      }
    }
  }

  return segments;
}

export function segmentsToRubyString(segments: RubySegment[]): string {
  return segments
    .map((segment) => {
      if (segment.type === "okurigana") {
        return `${segment.base}{${segment.rt}}`;
      }
      return segment.text;
    })
    .join("");
}
