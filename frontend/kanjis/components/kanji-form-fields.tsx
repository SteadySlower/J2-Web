"use client";

import type {
  UseFormReturn,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";
import Input from "@/frontend/core/components/form/input";

type KanjiFormFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
};

export default function KanjiFormFields<T extends FieldValues>({
  form,
}: KanjiFormFieldsProps<T>) {
  const {
    register,
    formState: { errors },
  } = form;

  const characterRegister = register("character" as Path<T>);
  const meaningRegister = register("meaning" as Path<T>);
  const onReadingRegister = register("on_reading" as Path<T>);
  const kunReadingRegister = register("kun_reading" as Path<T>);

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="한자"
        register={characterRegister}
        error={errors.character as FieldError | undefined}
        type="text"
      />
      <Input
        label="의미"
        register={meaningRegister}
        error={errors.meaning as FieldError | undefined}
        type="text"
        maxLength={100}
      />
      <Input
        label="음독"
        register={onReadingRegister}
        error={errors.on_reading as FieldError | undefined}
        type="text"
        maxLength={50}
      />
      <Input
        label="훈독"
        register={kunReadingRegister}
        error={errors.kun_reading as FieldError | undefined}
        type="text"
        maxLength={50}
      />
    </div>
  );
}
