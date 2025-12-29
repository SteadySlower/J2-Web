"use client";

import { useRef, useEffect } from "react";
import type { Path, UseFormReturn } from "react-hook-form";
import Input from "@/frontend/core/components/form/input";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import { Button } from "@/frontend/core/components/ui/button";
import { Loader2 } from "lucide-react";
import type { CreateKanjiRequest } from "@/lib/api/kanjis/create-kanji";
import { useSearchDictionaryByKanji } from "@/frontend/dictionary/hooks/useSearchDictionaryByKanji";

type KanjiFormData = CreateKanjiRequest;

type SearchStepProps = {
  form: UseFormReturn<KanjiFormData>;
  character: string;
  onCharacterSet: (character: string) => void;
  onSearchSuccess: () => void;
  onClose: () => void;
};

export default function SearchStep({
  form,
  character,
  onCharacterSet,
  onSearchSuccess,
  onClose,
}: SearchStepProps) {
  const isComposingRef = useRef(false);
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    trigger,
  } = form;

  const handleCharacterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("character" as Path<KanjiFormData>, value);
    trigger("character" as Path<KanjiFormData>);
  };

  const handleCharacterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposingRef.current) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    const currentValue = getValues(
      "character" as Path<KanjiFormData>
    ) as string;
    if (currentValue && currentValue.length === 1 && !errors.character) {
      onCharacterSet(currentValue);
    }
  };

  const dictionaryQuery = useSearchDictionaryByKanji(
    character,
    character.length === 1 && !errors.character
  );

  useEffect(() => {
    if (dictionaryQuery.data && character.length === 1 && !errors.character) {
      const data = dictionaryQuery.data as {
        meaning?: string;
        ondoku?: string;
        kundoku?: string;
      };
      setValue("character" as Path<KanjiFormData>, character);
      setValue("meaning" as Path<KanjiFormData>, data.meaning || "");
      setValue("on_reading" as Path<KanjiFormData>, data.ondoku || "");
      setValue("kun_reading" as Path<KanjiFormData>, data.kundoku || "");
      setTimeout(() => {
        onSearchSuccess();
      }, 0);
    }
  }, [
    dictionaryQuery.data,
    character,
    errors.character,
    setValue,
    onSearchSuccess,
  ]);

  return (
    <div className="h-full flex flex-col justify-between">
      <div />
      <Input
        label=""
        register={register("character" as Path<KanjiFormData>, {
          onChange: handleCharacterChange,
        })}
        error={errors.character}
        type="text"
        onKeyDown={handleCharacterKeyDown}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={() => {
          isComposingRef.current = false;
        }}
        placeholder="한자 입력 후 검색 해주세요."
      />
      {dictionaryQuery.isLoading && (
        <div className="text-muted-foreground text-sm">사전에서 검색 중...</div>
      )}
      {dictionaryQuery.isError && (
        <div className="text-destructive text-sm">
          {(dictionaryQuery.error as Error).message}
        </div>
      )}
      <div className="flex gap-2 justify-end">
        <CancelButton onClick={onClose} />
        <Button
          type="button"
          onClick={handleSearch}
          disabled={
            dictionaryQuery.isLoading ||
            !getValues("character") ||
            !!errors.character
          }
        >
          {dictionaryQuery.isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {dictionaryQuery.isLoading ? "검색 중..." : "검색"}
        </Button>
      </div>
    </div>
  );
}
