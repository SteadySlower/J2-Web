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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/frontend/core/components/ui/alert-dialog";
import Form from "@/frontend/core/components/form/form";
import SubmitButton from "@/frontend/core/components/form/submit-button";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import WordBookFormFields from "@/frontend/word-book/components/wordbook-form-fields";
import DeleteButton from "@/frontend/core/components/delete-button";
import {
  updateWordBookSchema,
  type UpdateWordBookRequest,
} from "@/lib/api/word-books/update-book";
import { useUpdateWordBook } from "@/frontend/word-book/hooks/useUpdateWordBook";
import { useDeleteWordBook } from "@/frontend/word-book/hooks/useDeleteWordBook";
import type { WordBook } from "@/lib/types/word-books";

type WordBookFormData = UpdateWordBookRequest;

type EditWordBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  wordbook: WordBook;
};

export default function EditWordBookModal({
  isOpen,
  onClose,
  wordbook,
}: EditWordBookModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<WordBookFormData>({
    resolver: zodResolver(updateWordBookSchema),
    defaultValues: {
      title: wordbook.title,
      showFront: wordbook.showFront,
    },
  });

  const updateMutation = useUpdateWordBook({
    wordbookId: wordbook.id,
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  const deleteMutation = useDeleteWordBook({
    wordbookId: wordbook.id,
    onMutate: () => {
      onClose();
    },
  });

  const onSubmit = (data: WordBookFormData) => {
    updateMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    reset({
      title: wordbook.title,
      showFront: wordbook.showFront,
    });
    updateMutation.reset();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>단어장 수정</DialogTitle>
          </DialogHeader>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <WordBookFormFields
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
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>단어장 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              단어장 및 단어장 안에 있는 단어들이 전부 삭제 됩니다. 이 작업은
              되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
