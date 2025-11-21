import { cn } from "@/lib/utils";
import { getTextSize } from "./utils";

type JapaneseTextProps = {
  text: string;
};

export default function JapaneseText({ text }: JapaneseTextProps) {
  return (
    <div className="flex-1 p-6 flex items-center justify-center">
      <p className={cn(getTextSize(text), "font-semibold")}>{text}</p>
    </div>
  );
}

