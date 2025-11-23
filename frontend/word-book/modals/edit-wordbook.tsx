"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
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
          <DeleteButton onClick={() => {}} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
