import { type ButtonHTMLAttributes } from "react";

type SubmitButtonProps = {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled">;

export default function SubmitButton({
  isLoading = false,
  loadingText = "처리 중...",
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      style={{
        padding: "8px 16px",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "#000000",
        color: "#ffffff",
        cursor: isLoading ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.5 : 1,
      }}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
