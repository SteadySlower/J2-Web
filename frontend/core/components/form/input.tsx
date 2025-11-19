import { type InputHTMLAttributes, type ReactNode } from "react";
import { type UseFormRegisterReturn, type FieldError } from "react-hook-form";

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
  ...props
}: InputProps) {
  const id = register.name;

  return (
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor={id} style={{ display: "block", marginBottom: "8px" }}>
        {label}
      </label>
      <input
        id={id}
        {...register}
        {...props}
        style={{
          width: "100%",
          padding: "8px",
          border: error ? "1px solid red" : "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      {error && (
        <div style={{ color: "red", marginTop: "4px", fontSize: "14px" }}>
          {error.message}
        </div>
      )}
      {children}
    </div>
  );
}
