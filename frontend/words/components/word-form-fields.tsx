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
    trigger,
    formState: { errors },
  } = form;
  const [isJapaneseFocused, setIsJapaneseFocused] = useState(false);
  const isComposingRef = useRef(false);
  const japaneseInputRef = useRef<HTMLInputElement>(null);
  const meaningInputRef = useRef<HTMLInputElement>(null);
  const japaneseValue = watch("japanese" as Path<T>) as string | undefined;
  const pronunciationValue = watch("pronunciation" as Path<T>) as
    | string
    | undefined;
  const showRubyText =
    !isJapaneseFocused && japaneseValue && japaneseValue.trim() !== "";

  const japaneseRegister = register("japanese" as Path<T>);
  const meaningRegister = register("meaning" as Path<T>);

  const updatePronunciation = (value: string) => {
    setValue("pronunciation" as Path<T>, value as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const toEditJapanese = () => {
    setTimeout(() => {
      if (japaneseInputRef.current) {
        japaneseInputRef.current.focus();
      }
    }, 0);
    setIsJapaneseFocused(true);
  };

  const onRubyTextChanged = (newRt: string) => {
    updatePronunciation(newRt);
    setTimeout(() => {
      if (meaningInputRef.current) {
        meaningInputRef.current.focus();
      }
    }, 0);
  };

  const onJapaneseEditEnded = (value: string) => {
    if (value) {
      const okurigana = parseToEmptyOkurigana(value);
      updatePronunciation(okurigana);
    } else {
      updatePronunciation("");
    }
    setTimeout(() => {
      setIsJapaneseFocused(false);
    }, 0);
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
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toEditJapanese();
              }}
              className="w-4 h-4 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer text-gray-400 hover:text-gray-600"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>
        {showRubyText ? (
          <div className="text-3xl flex items-center cursor-text">
            <EditableRubyText
              rubyString={pronunciationValue ?? ""}
              onRtChange={onRubyTextChanged}
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
                await japaneseRegister.onBlur(e);
                onJapaneseEditEnded(e.target.value);
                await trigger("japanese" as Path<T>);
              },
            }}
            type="text"
            onFocus={() => setIsJapaneseFocused(true)}
            onCompositionStart={() => {
              isComposingRef.current = true;
            }}
            onCompositionEnd={() => {
              isComposingRef.current = false;
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !isComposingRef.current) {
                e.preventDefault();
                onJapaneseEditEnded(e.currentTarget.value);
                await trigger("japanese" as Path<T>);
              }
            }}
          />
        )}
        {errors.japanese && (
          <div className="text-sm text-destructive">
            {(errors.japanese as FieldError).message}
          </div>
        )}
      </div>
      <Input
        label="의미"
        register={{
          ...meaningRegister,
          ref: (e: HTMLInputElement | null) => {
            meaningRegister.ref(e);
            meaningInputRef.current = e;
          },
        }}
        error={errors.meaning as FieldError | undefined}
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            toEditJapanese();
          }
        }}
      />
    </>
  );
}
