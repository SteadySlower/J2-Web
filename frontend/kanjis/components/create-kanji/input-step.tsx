"use client";

import type { Path, UseFormReturn } from "react-hook-form";
import Input from "@/frontend/core/components/form/input";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import SubmitButton from "@/frontend/core/components/form/submit-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@/frontend/core/components/ui/tooltip";
import type { CreateKanjiRequest } from "@/lib/api/kanjis/create-kanji";
import type { UseMutationResult } from "@tanstack/react-query";

type KanjiFormData = CreateKanjiRequest;

type InputStepProps = {
  form: UseFormReturn<KanjiFormData>;
  character: string;
  mutation: UseMutationResult<unknown, Error, KanjiFormData>;
  onCharacterClick: () => void;
  onClose: () => void;
};

export default function InputStep({
  form,
  character,
  mutation,
  onCharacterClick,
  onClose,
}: InputStepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const meaningRegister = register("meaning" as Path<KanjiFormData>);
  const onReadingRegister = register("on_reading" as Path<KanjiFormData>);
  const kunReadingRegister = register("kun_reading" as Path<KanjiFormData>);

  return (
    <>
      <div className="mb-4 flex flex-col gap-2">
        <label className="text-sm font-medium">한자</label>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="text-lg font-semibold p-2 border border-border rounded-md bg-secondary text-secondary-foreground cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={onCharacterClick}
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
          error={errors.meaning}
          type="text"
          maxLength={100}
        />
        <Input
          label="음독"
          register={onReadingRegister}
          error={errors.on_reading}
          type="text"
          maxLength={50}
        />
        <Input
          label="훈독"
          register={kunReadingRegister}
          error={errors.kun_reading}
          type="text"
          maxLength={50}
        />
      </div>
      {mutation.isError && (
        <div className="text-destructive mb-4">
          {(mutation.error as Error).message}
        </div>
      )}
      <div className="flex gap-2 justify-end">
        <CancelButton onClick={onClose} />
        <SubmitButton isLoading={mutation.isPending} loadingText="생성 중...">
          생성
        </SubmitButton>
      </div>
    </>
  );
}
