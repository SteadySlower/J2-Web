import { type ButtonHTMLAttributes } from "react";
import { Button } from "@/frontend/core/components/ui/button";
import { Loader2 } from "lucide-react";

type SubmitButtonProps = {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled">;

export default function SubmitButton({
  isLoading = false,
  loadingText = "처리 중...",
  children,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? loadingText : children}
    </Button>
  );
}
