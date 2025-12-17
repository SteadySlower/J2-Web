"use client";

import { useState, useRef } from "react";
import { Edit } from "lucide-react";
import Input from "@/frontend/core/components/form/input";
import EditableRubyText from "@/frontend/ruby/components/editable-ruby-text";
import { parseToEmptyOkurigana } from "@/lib/utils";
import type {
  PathValue,
  UseFormReturn,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";

type WordFormFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
};

export default function WordFormFields<T extends FieldValues>({
  form,
}: WordFormFieldsProps<T>) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const [isJapaneseFocused, setIsJapaneseFocused] = useState(false);
  const japaneseInputRef = useRef<HTMLInputElement>(null);
  const japaneseValue = watch("japanese" as Path<T>) as string | undefined;
  const pronunciationValue = watch("pronunciation" as Path<T>) as
    | string
    | undefined;
  const showRubyText =
    !isJapaneseFocused && japaneseValue && japaneseValue.trim() !== "";

  const japaneseRegister = register("japanese" as Path<T>);

  const onRubyEditButtonClick = () => {
    setTimeout(() => {
      if (japaneseInputRef.current) {
        japaneseInputRef.current.focus();
      }
    }, 0);
    setIsJapaneseFocused(true);
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="japanese" className="text-sm font-medium">
            일본어
          </label>
          {showRubyText && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onRubyEditButtonClick();
              }}
              className="w-4 h-4 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer text-gray-400 hover:text-gray-600"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>
        {showRubyText ? (
          <div className="min-h-10 text-3xl flex items-center cursor-text">
            <EditableRubyText
              rubyString={pronunciationValue ?? ""}
              onRtChange={(newRt) => {
                setValue(
                  "pronunciation" as Path<T>,
                  newRt as PathValue<T, Path<T>>,
                  { shouldDirty: true }
                );
              }}
            />
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
                japaneseRegister.onBlur(e);
                const japaneseValue = e.target.value;
                if (japaneseValue) {
                  const okurigana = parseToEmptyOkurigana(japaneseValue);
                  setValue(
                    "pronunciation" as Path<T>,
                    okurigana as PathValue<T, Path<T>>
                  );
                } else {
                  setValue(
                    "pronunciation" as Path<T>,
                    "" as PathValue<T, Path<T>>
                  );
                }
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
    </>
  );
}
