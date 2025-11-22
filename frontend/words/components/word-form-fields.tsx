"use client";

import Input from "@/frontend/core/components/form/input";
import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";

type WordFormFieldsProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

export default function WordFormFields<T extends FieldValues>({
  register,
  errors,
}: WordFormFieldsProps<T>) {
  return (
    <>
      <Input
        label="일본어"
        register={register("japanese" as Path<T>)}
        error={errors.japanese as FieldError | undefined}
        type="text"
      />
      <Input
        label="의미"
        register={register("meaning" as Path<T>)}
        error={errors.meaning as FieldError | undefined}
        type="text"
      />
      <Input
        label="발음"
        register={register("pronunciation" as Path<T>)}
        error={errors.pronunciation as FieldError | undefined}
        type="text"
      />
    </>
  );
}
