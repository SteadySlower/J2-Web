import { type InputHTMLAttributes, type ReactNode } from "react";
import { type UseFormRegisterReturn, type FieldError } from "react-hook-form";
import { Input as ShadcnInput } from "@/frontend/core/components/ui/input";
import { Label } from "@/frontend/core/components/ui/label";
import { cn } from "@/lib/utils";

type InputProps = {
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
  children?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export default function Input({
  label,
  error,
  register,
  children,
  className,
  ...props
}: InputProps) {
  const id = register.name;

  return (
    <div className="mb-4 flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <ShadcnInput
        id={id}
        {...register}
        {...props}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
      />
      {error && (
        <div className="text-sm text-destructive text-red-500 mt-1">
          {error.message}
        </div>
      )}
      {children}
    </div>
  );
}
