"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import Form from "@/frontend/core/components/form/form";
import SubmitButton from "@/frontend/core/components/form/submit-button";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import WordFormFields from "@/frontend/words/components/word-form-fields";
import type { CreateWordRequest } from "@/lib/api/words/create-word";
import type { UseMutationResult } from "@tanstack/react-query";
import type { CreateWordResponse } from "@/lib/api/words/create-word";

type WordFormData = CreateWordRequest;

type CreateWordMutation = UseMutationResult<
  CreateWordResponse,
  Error,
  WordFormData,
  unknown
>;

type WordInputProps = {
  form: UseFormReturn<WordFormData>;
  createMutation: CreateWordMutation;
  onSubmit: (data: WordFormData) => void;
  onClose: () => void;
};

export default function WordInput({
  form,
  createMutation,
  onSubmit,
  onClose,
}: WordInputProps) {
  const [isJapaneseEditing, setIsJapaneseEditing] = useState(false);

  const handleClose = () => {
    onClose();
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <WordFormFields
        form={form}
        onJapaneseEditingChanged={setIsJapaneseEditing}
      />
      {createMutation.isError && (
        <div className="text-destructive mb-4">
          {(createMutation.error as Error).message}
        </div>
      )}
      <div className="flex gap-2 justify-end">
        <CancelButton onClick={handleClose} />
        <SubmitButton
          isLoading={createMutation.isPending}
          disabled={isJapaneseEditing}
          loadingText="생성 중..."
        >
          생성
        </SubmitButton>
      </div>
    </Form>
  );
}
