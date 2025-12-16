"use client";

import { useState, useRef, useEffect } from "react";
import Input from "@/frontend/core/components/form/input";
import RubyText from "@/frontend/core/components/ruby-text";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";

type WordFormFieldsProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  watch: UseFormWatch<T>;
};

export default function WordFormFields<T extends FieldValues>({
  register,
  errors,
  watch,
}: WordFormFieldsProps<T>) {
  const [isJapaneseFocused, setIsJapaneseFocused] = useState(false);
  const japaneseInputRef = useRef<HTMLInputElement>(null);
  const japaneseValue = watch("japanese" as Path<T>) as string | undefined;
  const showRubyText =
    !isJapaneseFocused && japaneseValue && japaneseValue.trim() !== "";

  const japaneseRegister = register("japanese" as Path<T>);
  const originalOnBlur = japaneseRegister.onBlur;

  useEffect(() => {
    if (!showRubyText && japaneseInputRef.current) {
      japaneseInputRef.current.focus();
    }
  }, [showRubyText]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-2">
        <label htmlFor="japanese" className="text-sm font-medium">
          일본어
        </label>
        {showRubyText ? (
          <div
            className="min-h-10 text-3xl flex items-center cursor-text"
            onClick={() => setIsJapaneseFocused(true)}
          >
            <RubyText rubyString={japaneseValue} />
          </div>
        ) : (
          <Input
            label=""
            register={{
              ...japaneseRegister,
              ref: (e: HTMLInputElement | null) => {
                japaneseRegister.ref(e);
                japaneseInputRef.current = e;
              },
              onBlur: async (e) => {
                originalOnBlur(e);
                setTimeout(() => {
                  setIsJapaneseFocused(false);
                }, 0);
              },
            }}
            error={errors.japanese as FieldError | undefined}
            type="text"
            onFocus={() => setIsJapaneseFocused(true)}
          />
        )}
        {errors.japanese && showRubyText && (
          <div className="text-sm text-destructive mt-1">
            {(errors.japanese as FieldError).message}
          </div>
        )}
      </div>
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
