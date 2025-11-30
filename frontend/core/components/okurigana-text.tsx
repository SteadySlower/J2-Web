import React from "react";

type RubySegment =
  | { type: "okurigana"; base: string; rt: string }
  | { type: "text"; text: string };

function parseRubyString(input: string): RubySegment[] {
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
        segments.push({ type: "text", text });
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
      segments.push({ type: "text", text });
    }
  }

  return segments;
}

function RubyItem({ base, rt }: { base: string; rt: string }) {
  return (
    <span className="relative inline-block text-center">
      <span className="inline-block">{base}</span>
      <span className="absolute -top-[0.3em] left-1/2 -translate-x-1/2 text-[0.5em] leading-none whitespace-nowrap pointer-events-none">
        {rt}
      </span>
    </span>
  );
}

export default function RubyText({ rubyString }: { rubyString: string }) {
  const segments = parseRubyString(rubyString);

  return (
    <span
      className="inline-flex flex-wrap items-baseline"
      style={{ lineHeight: "calc(1em + 0.8em)" }}
    >
      {segments.map((segment, index) => {
        if (segment.type === "okurigana") {
          return <RubyItem key={index} base={segment.base} rt={segment.rt} />;
        }
        return (
          <span key={index} className="inline-block">
            {segment.text}
          </span>
        );
      })}
    </span>
  );
}
