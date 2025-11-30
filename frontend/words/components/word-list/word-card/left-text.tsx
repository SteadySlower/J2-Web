import { cn } from "@/lib/utils";
import { getTextSize } from "./utils";
import RubyText from "@/frontend/core/components/ruby-text";

type LeftTextProps = {
  text: string;
};

export default function LeftText({ text }: LeftTextProps) {
  const hasOkurigana = text.includes("{");

  return (
    <div className="flex-1 p-6 flex items-center justify-center">
      <p className={cn(getTextSize(text), "font-semibold")}>
        {hasOkurigana ? <RubyText rubyString={text} /> : text}
      </p>
    </div>
  );
}
