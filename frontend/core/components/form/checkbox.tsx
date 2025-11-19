import { type InputHTMLAttributes } from "react";
import { type UseFormRegisterReturn, type FieldError } from "react-hook-form";

type CheckboxProps = {
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id">;

export default function Checkbox({
  label,
  error,
  register,
  ...props
}: CheckboxProps) {
  const id = register.name;

  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        htmlFor={id}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <input id={id} type="checkbox" {...register} {...props} />
        {label}
      </label>
      {error && (
        <div style={{ color: "red", marginTop: "4px", fontSize: "14px" }}>
          {error.message}
        </div>
      )}
    </div>
  );
}
