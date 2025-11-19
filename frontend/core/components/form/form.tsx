import { type ReactNode, type FormHTMLAttributes } from "react";
import { type UseFormHandleSubmit, type FieldValues } from "react-hook-form";

type FormProps<T extends FieldValues> = {
  onSubmit: ReturnType<UseFormHandleSubmit<T>>;
  children: ReactNode;
} & Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit">;

export default function Form<T extends FieldValues>({
  onSubmit,
  children,
  ...props
}: FormProps<T>) {
  return (
    <form onSubmit={onSubmit} {...props}>
      {children}
    </form>
  );
}
