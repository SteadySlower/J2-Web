"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Edit, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Input from "@/frontend/core/components/form/input";
import EditableRubyText from "@/frontend/ruby/components/editable-ruby-text";
import { getPronunciation } from "@/lib/api/dictionary/get-pronunciation";
import { containsKanji, parseToEmptyOkurigana } from "@/lib/utils";
import type {
  PathValue,
  UseFormReturn,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";

type WordFormFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onJapaneseEditingChanged?: (isEditing: boolean) => void;
};

export default function WordFormFields<T extends FieldValues>({
  form,
  onJapaneseEditingChanged,
}: WordFormFieldsProps<T>) {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = form;
  const queryClient = useQueryClient();
  const [isJapaneseFocused, setIsJapaneseFocused] = useState(false);
  const [isLoadingPronunciation, setIsLoadingPronunciation] = useState(false);
  const isComposingRef = useRef(false);
  const japaneseInputRef = useRef<HTMLInputElement>(null);
  const meaningInputRef = useRef<HTMLInputElement>(null);
  const japaneseValue = watch("japanese" as Path<T>) as string | undefined;
  const pronunciationValue = watch("pronunciation" as Path<T>) as
    | string
    | undefined;
  const showRubyText = !isJapaneseFocused && Boolean(japaneseValue?.trim());

  const updatePronunciation = useCallback(
    (value: string) => {
      setValue("pronunciation" as Path<T>, value as PathValue<T, Path<T>>, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  useEffect(() => {
    onJapaneseEditingChanged?.(isJapaneseFocused);
  }, [isJapaneseFocused, onJapaneseEditingChanged]);

  const japaneseRegister = useMemo(
    () => register("japanese" as Path<T>),
    [register]
  );
  const meaningRegister = useMemo(
    () => register("meaning" as Path<T>),
    [register]
  );

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

  const onJapaneseEditEnded = async (value: string) => {
    if (!value) {
      updatePronunciation("");
    } else if (containsKanji(value)) {
      setIsLoadingPronunciation(true);
      try {
        const pronunciation = await queryClient.fetchQuery({
          queryKey: ["dictionary", "pronunciation", value],
          queryFn: () => getPronunciation(value),
        });
        updatePronunciation(pronunciation);
      } catch {
        // 에러 발생 시 parseToEmptyOkurigana 사용
        const fallbackPronunciation = parseToEmptyOkurigana(value);
        updatePronunciation(fallbackPronunciation);
        toast.error("발음 조회에 실패했습니다. 기본 발음으로 설정되었습니다.");
      } finally {
        setIsLoadingPronunciation(false);
      }
    } else {
      updatePronunciation(value);
    }
    setTimeout(() => {
      setIsJapaneseFocused(false);
    }, 0);
  };

  return (
    <div className="relative">
      {isLoadingPronunciation && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
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
                await onJapaneseEditEnded(e.target.value);
                await trigger("japanese" as Path<T>);
              },
            }}
            type="text"
            maxLength={100}
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
                await onJapaneseEditEnded(e.currentTarget.value);
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
        maxLength={100}
        onKeyDown={(e) => {
          if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            toEditJapanese();
          }
        }}
      />
    </div>
  );
}
