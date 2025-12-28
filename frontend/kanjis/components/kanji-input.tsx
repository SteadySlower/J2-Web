"use client";

import type { UseFormReturn } from "react-hook-form";
import Form from "@/frontend/core/components/form/form";
import SubmitButton from "@/frontend/core/components/form/submit-button";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import KanjiFormFields from "@/frontend/kanjis/components/kanji-form-fields";
import type { CreateKanjiRequest } from "@/lib/api/kanjis/create-kanji";
import type { UseMutationResult } from "@tanstack/react-query";
import type { CreateKanjiResponse } from "@/lib/api/kanjis/create-kanji";

type KanjiFormData = CreateKanjiRequest;

type CreateKanjiMutation = UseMutationResult<
  CreateKanjiResponse,
  Error,
  KanjiFormData,
  unknown
>;

type KanjiInputProps = {
  form: UseFormReturn<KanjiFormData>;
  createMutation: CreateKanjiMutation;
  onSubmit: (data: KanjiFormData) => void;
  onClose: () => void;
};

export default function KanjiInput({
  form,
  createMutation,
  onSubmit,
  onClose,
}: KanjiInputProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <KanjiFormFields form={form} />
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
    </Form>
  );
}

