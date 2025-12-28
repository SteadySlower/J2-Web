"use client";

import Input from "@/frontend/core/components/form/input";
import Checkbox from "@/frontend/core/components/form/checkbox";
import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
  FieldError,
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
    <>
      <Input
        label="제목"
        register={register("title" as Path<T>)}
        error={errors.title as FieldError | undefined}
        type="text"
      />
      <Checkbox
        label="한자 앞면"
        name={"showFront" as Path<T>}
        control={control}
        error={errors.showFront as FieldError | undefined}
      />
    </>
  );
}
