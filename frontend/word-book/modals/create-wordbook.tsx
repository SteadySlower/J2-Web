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
import {
  createWordBookSchema,
  type CreateWordBookRequest,
} from "@/lib/api/word-books/create-book";
import { useCreateWordBook } from "@/frontend/word-book/hooks/useCreateWordBook";

type WordBookFormData = CreateWordBookRequest;

type CreateWordBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateWordBookModal({
  isOpen,
  onClose,
}: CreateWordBookModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<WordBookFormData>({
    resolver: zodResolver(createWordBookSchema),
    defaultValues: {
      showFront: true,
    },
  });

  const createMutation = useCreateWordBook({
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  const onSubmit = (data: WordBookFormData) => {
    createMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    reset();
    createMutation.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>단어장 생성</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <WordBookFormFields
            register={register}
            control={control}
            errors={errors}
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
              loadingText="생성 중..."
            >
              생성
            </SubmitButton>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
