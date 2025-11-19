import { type ButtonHTMLAttributes } from "react";

type CancelButtonProps = {
  children?: React.ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export default function CancelButton({
  children = "취소",
  ...props
}: CancelButtonProps) {
  return (
    <button
      type="button"
      style={{
        padding: "8px 16px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "white",
        cursor: "pointer",
      }}
      {...props}
    >
      {children}
    </button>
  );
}
