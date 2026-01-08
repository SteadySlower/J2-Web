import { useMemo } from "react";
import { parseRubyString } from "../utils";
import { cn } from "@/lib/utils";

export function RubyItem({ base, rt }: { base: string; rt: string }) {
  return (
    <span className="inline-flex flex-col items-center leading-tight">
      <span className="text-[0.5em] leading-none whitespace-nowrap">{rt}</span>
      <span className="whitespace-nowrap">{base}</span>
    </span>
  );
}

interface RubyTextProps {
  rubyString: string;
  className?: string;
}

export default function RubyText({ rubyString, className }: RubyTextProps) {
  const segments = useMemo(() => parseRubyString(rubyString), [rubyString]);

  return (
    <span className={cn("inline-flex flex-wrap items-end", className)}>
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
