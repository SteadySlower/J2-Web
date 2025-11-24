import { cn } from "@/lib/utils";
import { getTextSize } from "./utils";

type LeftTextProps = {
  text: string;
};

export default function LeftText({ text }: LeftTextProps) {
  return (
    <div className="flex-1 p-6 flex items-center justify-center">
      <p className={cn(getTextSize(text), "font-semibold")}>{text}</p>
    </div>
  );
}
