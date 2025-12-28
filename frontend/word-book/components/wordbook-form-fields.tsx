"use client";

import BookFormFields from "@/frontend/core/components/books/form-fields";
import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Control,
} from "react-hook-form";

type WordBookFormFieldsProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
};

export default function WordBookFormFields<T extends FieldValues>({
  register,
  control,
  errors,
}: WordBookFormFieldsProps<T>) {
  return (
    <BookFormFields
      register={register}
      control={control}
      errors={errors}
      showFrontLabel="일본어 앞면"
    />
  );
}
