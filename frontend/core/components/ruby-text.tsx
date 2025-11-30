import React from "react";

type RubySegment =
  | { type: "ruby"; base: string; rt: string }
  | { type: "text"; text: string };

function parseRubyString(input: string): RubySegment[] {
  const segments: RubySegment[] = [];
  let currentIndex = 0;

  // ruby 태그 패턴: <ruby>base<rp>(</rp><rt>rt</rt><rp>)</rp></ruby>
  const rubyRegex =
    /<ruby>([^<]+)<rp>\(<\/rp><rt>([^<]+)<\/rt><rp>\)<\/rp><\/ruby>/g;
  let match;

  while ((match = rubyRegex.exec(input)) !== null) {
    // ruby 태그 이전의 일반 텍스트
    if (match.index > currentIndex) {
      const text = input.slice(currentIndex, match.index);
      if (text) {
        segments.push({ type: "text", text });
      }
    }

    // ruby 태그 내용
    segments.push({
      type: "ruby",
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
    <span className="relative inline-block">
      <span className="inline-block">{base}</span>
      <span className="absolute -top-[0.8em] left-0 right-0 text-[0.5em] leading-none text-center whitespace-nowrap pointer-events-none">
        {rt}
      </span>
    </span>
  );
}

export default function RubyText({ rubyString }: { rubyString: string }) {
  const segments = parseRubyString(rubyString);

  return (
    <span className="inline-flex flex-wrap items-baseline">
      {segments.map((segment, index) => {
        if (segment.type === "ruby") {
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
