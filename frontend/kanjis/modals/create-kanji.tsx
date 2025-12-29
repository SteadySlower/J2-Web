"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Path, FieldError } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
import {
  createKanjiSchema,
  type CreateKanjiRequest,
} from "@/lib/api/kanjis/create-kanji";
import { useCreateKanji } from "@/frontend/kanjis/hooks/useCreateKanji";
import { useParams } from "next/navigation";
import Form from "@/frontend/core/components/form/form";
import SubmitButton from "@/frontend/core/components/form/submit-button";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import Input from "@/frontend/core/components/form/input";
import { Button } from "@/frontend/core/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSearchDictionaryByKanji } from "@/frontend/dictionary/hooks/useSearchDictionaryByKanji";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@/frontend/core/components/ui/tooltip";

type KanjiFormData = CreateKanjiRequest;

type CreateKanjiModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
};

export default function CreateKanjiModal({
  isOpen,
  onClose,
  onCreated,
}: CreateKanjiModalProps) {
  const params = useParams();
  const kanjibookId = params.id as string;
  const [step, setStep] = useState<"search" | "input">("search");
  const [character, setCharacter] = useState<string>("");
  const isComposingRef = useRef(false);

  const form = useForm<KanjiFormData>({
    resolver: zodResolver(createKanjiSchema),
    defaultValues: {
      kanji_book_id: kanjibookId,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
    getValues,
    trigger,
  } = form;

  const isKanji = /^[\u4E00-\u9FFF]$/.test(character);

  const dictionaryQuery = useSearchDictionaryByKanji(
    character,
    step === "search" && character.length === 1 && isKanji
  );

  useEffect(() => {
    if (
      dictionaryQuery.data &&
      step === "search" &&
      character.length === 1 &&
      isKanji
    ) {
      const data = dictionaryQuery.data;
      setValue("character" as Path<KanjiFormData>, character);
      setValue("meaning" as Path<KanjiFormData>, data.meaning || "");
      setValue("on_reading" as Path<KanjiFormData>, data.ondoku || "");
      setValue("kun_reading" as Path<KanjiFormData>, data.kundoku || "");
      setTimeout(() => {
        setStep("input");
      }, 0);
    }
  }, [dictionaryQuery.data, character, step, setValue, isKanji]);

  const createMutation = useCreateKanji({
    bookId: kanjibookId,
    onSuccess: (kanjiId) => {
      onCreated(kanjiId);
      onClose();
      reset();
      setStep("search");
      setCharacter("");
    },
  });

  const onSubmit = (data: KanjiFormData) => {
    createMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    reset();
    createMutation.reset();
    setStep("search");
    setCharacter("");
  };

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 1) {
      const isValueKanji = /^[\u4E00-\u9FFF]$/.test(trimmedValue);
      if (isValueKanji) {
        setCharacter(trimmedValue);
      } else {
        setError("character" as Path<KanjiFormData>, {
          type: "pattern",
          message: "한자만 입력 가능합니다",
        });
      }
    } else if (trimmedValue.length > 1) {
      setError("character" as Path<KanjiFormData>, {
        type: "maxLength",
        message: "한자 문자는 최대 1자까지 입력 가능합니다",
      });
    }
  };

  const handleCharacterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposingRef.current) {
      e.preventDefault();
      handleSearch(e.currentTarget.value);
    }
  };

  const handleSearchButtonClick = () => {
    const currentValue = getValues(
      "character" as Path<KanjiFormData>
    ) as string;
    handleSearch(currentValue || "");
  };

  const handleCharacterClick = () => {
    setStep("search");
    setCharacter("");
    setValue("character" as Path<KanjiFormData>, "");
    setValue("meaning" as Path<KanjiFormData>, "");
    setValue("on_reading" as Path<KanjiFormData>, "");
    setValue("kun_reading" as Path<KanjiFormData>, "");
  };

  const handleCharacterChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    await trigger("character" as Path<KanjiFormData>);
    if (value.length > 1) {
      setError("character" as Path<KanjiFormData>, {
        type: "maxLength",
        message: "한자 문자는 최대 1자까지 입력 가능합니다",
      });
    }
  };

  const meaningRegister = register("meaning" as Path<KanjiFormData>);
  const onReadingRegister = register("on_reading" as Path<KanjiFormData>);
  const kunReadingRegister = register("kun_reading" as Path<KanjiFormData>);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>한자 추가</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {step === "search" ? (
            <div className="h-full flex flex-col justify-between">
              <div />
              <Input
                label=""
                register={register("character" as Path<KanjiFormData>, {
                  onChange: handleCharacterChange,
                })}
                error={errors.character as FieldError | undefined}
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
                <div className="text-muted-foreground text-sm">
                  사전에서 검색 중...
                </div>
              )}
              {dictionaryQuery.isError && (
                <div className="text-destructive text-sm">
                  {(dictionaryQuery.error as Error).message}
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <CancelButton onClick={handleClose} />
                <Button
                  type="button"
                  onClick={handleSearchButtonClick}
                  disabled={
                    dictionaryQuery.isLoading ||
                    !getValues("character" as Path<KanjiFormData>)
                  }
                >
                  {dictionaryQuery.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {dictionaryQuery.isLoading ? "검색 중..." : "검색"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-col gap-2">
                <label className="text-sm font-medium">한자</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="text-lg font-semibold p-2 border rounded-md bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={handleCharacterClick}
                    >
                      {character}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>다른 한자 검색</p>
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-col gap-4">
                <Input
                  label="의미"
                  register={meaningRegister}
                  error={errors.meaning as FieldError | undefined}
                  type="text"
                  maxLength={100}
                />
                <Input
                  label="음독"
                  register={onReadingRegister}
                  error={errors.on_reading as FieldError | undefined}
                  type="text"
                  maxLength={50}
                />
                <Input
                  label="훈독"
                  register={kunReadingRegister}
                  error={errors.kun_reading as FieldError | undefined}
                  type="text"
                  maxLength={50}
                />
              </div>
              {createMutation.isError && (
                <div className="text-destructive mb-4">
                  {(createMutation.error as Error).message}
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <CancelButton onClick={handleClose} />
                <SubmitButton
                  isLoading={createMutation.isPending}
                  loadingText="생성 중..."
                >
                  생성
                </SubmitButton>
              </div>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
