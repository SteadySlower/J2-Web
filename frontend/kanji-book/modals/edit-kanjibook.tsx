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
import KanjiBookFormFields from "@/frontend/kanji-book/components/kanjibook-form-fields";
import DeleteButton from "@/frontend/core/components/delete-button";
import {
  updateKanjiBookSchema,
  type UpdateKanjiBookRequest,
} from "@/lib/api/kanji-books/update-book";
import { useUpdateKanjiBook } from "@/frontend/kanji-book/hooks/useUpdateKanjiBook";
import { useDeleteKanjiBook } from "@/frontend/kanji-book/hooks/useDeleteKanjiBook";
import type { KanjiBook } from "@/frontend/core/types/kanji-book";

type KanjiBookFormData = UpdateKanjiBookRequest;

type EditKanjiBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  kanjibook: KanjiBook;
};

export default function EditKanjiBookModal({
  isOpen,
  onClose,
  kanjibook,
}: EditKanjiBookModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm<KanjiBookFormData>({
    resolver: zodResolver(updateKanjiBookSchema),
    defaultValues: {
      title: kanjibook.title,
      showFront: kanjibook.showFront,
    },
  });

  const updateMutation = useUpdateKanjiBook({
    kanjibookId: kanjibook.id,
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  const deleteMutation = useDeleteKanjiBook({
    kanjibookId: kanjibook.id,
    onMutate: () => {
      onClose();
    },
  });

  const onSubmit = (data: KanjiBookFormData) => {
    if (!isDirty) {
      return;
    }
    updateMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    reset({
      title: kanjibook.title,
      showFront: kanjibook.showFront,
    });
    updateMutation.reset();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>한자장 수정</DialogTitle>
          </DialogHeader>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <KanjiBookFormFields
              register={register}
              control={control}
              errors={errors}
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
                disabled={!isDirty}
                loadingText="수정 중..."
              >
                수정
              </SubmitButton>
            </div>
          </Form>
          <div className="absolute bottom-7 left-4">
            <DeleteButton onClick={() => setShowDeleteConfirm(true)} />
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmAlertDialog
        title="한자장 삭제"
        description="한자장 및 한자장 안에 있는 한자들이 전부 삭제 됩니다. 이 작업은 되돌릴 수 없습니다."
        actionButtonLabel="삭제"
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onActionButtonClicked={() => deleteMutation.mutate()}
      />
    </>
  );
}
