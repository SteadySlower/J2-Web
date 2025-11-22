"use client";

import Input from "@/frontend/core/components/form/input";
import Checkbox from "@/frontend/core/components/form/checkbox";
import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";

type WordBookFormFieldsProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

export default function WordBookFormFields<T extends FieldValues>({
  register,
  errors,
}: WordBookFormFieldsProps<T>) {
  return (
    <>
      <Input
        label="제목"
        register={register("title" as Path<T>)}
        error={errors.title as FieldError | undefined}
        type="text"
      />
      <Checkbox
        label="일본어 앞면"
        register={register("showFront" as Path<T>)}
        error={errors.showFront as FieldError | undefined}
      />
    </>
  );
}
