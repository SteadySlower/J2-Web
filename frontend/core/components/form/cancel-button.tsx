import { type ButtonHTMLAttributes } from "react";
import { Button } from "@/frontend/core/components/ui/button";

type CancelButtonProps = {
  children?: React.ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export default function CancelButton({
  children = "취소",
  className,
  ...props
}: CancelButtonProps) {
  return (
    <Button type="button" variant="outline" className={className} {...props}>
      {children}
    </Button>
  );
}
