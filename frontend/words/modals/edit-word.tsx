"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
import ConfirmAlertDialog from "@/frontend/core/components/alert-dialog";
import Form from "@/frontend/core/components/form/form";
import SubmitButton from "@/frontend/core/components/form/submit-button";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import DeleteButton from "@/frontend/core/components/delete-button";
import {
  updateWordSchema,
  type UpdateWordRequest,
} from "@/lib/api/words/update-word";
import type { Word } from "@/lib/types/word";
import WordFormFields from "@/frontend/words/components/word-form-fields";
import { useParams } from "next/navigation";
import { useUpdateWord } from "@/frontend/words/hooks/useUpdateWord";
import { useDeleteWord } from "@/frontend/words/hooks/useDeleteWord";

type WordFormData = UpdateWordRequest;

type EditWordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  word: Word;
};

export default function EditWordModal({
  isOpen,
  onClose,
  word,
}: EditWordModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const params = useParams();
  const bookId = params.id as string;

  const form = useForm<WordFormData>({
    resolver: zodResolver(updateWordSchema),
    defaultValues: {
      japanese: word.japanese,
      meaning: word.meaning,
      pronunciation: word.pronunciation || "",
    },
  });

  const [isJapaneseEditing, setIsJapaneseEditing] = useState(false);

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
  } = form;

  const updateMutation = useUpdateWord({
    wordId: word.id,
    bookId,
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  const deleteMutation = useDeleteWord({
    wordId: word.id,
    bookId,
    onMutate: () => {
      onClose();
    },
  });

  const onSubmit = (data: WordFormData) => {
    if (!isDirty) {
      return;
    }
    updateMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    reset({
      japanese: word.japanese,
      meaning: word.meaning,
      pronunciation: word.pronunciation || "",
    });
    updateMutation.reset();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>단어 수정</DialogTitle>
          </DialogHeader>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <WordFormFields
              form={form}
              onJapaneseEditingChanged={setIsJapaneseEditing}
            />
            {updateMutation.isError && (
              <div className="text-destructive mb-4">
                {(updateMutation.error as Error).message}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <CancelButton onClick={handleClose} />
              <SubmitButton
                isLoading={updateMutation.isPending}
                disabled={!isDirty || isJapaneseEditing}
                loadingText="수정 중..."
              >
                수정
              </SubmitButton>
            </div>
          </Form>
          <div className="absolute bottom-8 left-5">
            <DeleteButton onClick={() => setShowDeleteConfirm(true)} />
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmAlertDialog
        title="단어 삭제"
        description="이 단어가 삭제 됩니다. 이 작업은 되돌릴 수 없습니다."
        actionButtonLabel="삭제"
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onActionButtonClicked={() => deleteMutation.mutate()}
      />
    </>
  );
}
