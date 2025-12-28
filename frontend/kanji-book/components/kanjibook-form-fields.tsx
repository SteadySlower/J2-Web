"use client";

import BookFormFields from "@/frontend/core/components/books/form-fields";
import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Control,
} from "react-hook-form";

type KanjiBookFormFieldsProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
};

export default function KanjiBookFormFields<T extends FieldValues>({
  register,
  control,
  errors,
}: KanjiBookFormFieldsProps<T>) {
  return (
    <BookFormFields
      register={register}
      control={control}
      errors={errors}
      showFrontLabel="한자 앞면"
    />
  );
}
