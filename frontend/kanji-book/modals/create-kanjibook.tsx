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
import KanjiBookFormFields from "@/frontend/kanji-book/components/kanjibook-form-fields";
import {
  createKanjiBookSchema,
  type CreateKanjiBookRequest,
} from "@/lib/api/kanji-books/create-book";
import { useCreateKanjiBook } from "@/frontend/kanji-book/hooks/useCreateKanjiBook";

type KanjiBookFormData = CreateKanjiBookRequest;

type CreateKanjiBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateKanjiBookModal({
  isOpen,
  onClose,
}: CreateKanjiBookModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<KanjiBookFormData>({
    resolver: zodResolver(createKanjiBookSchema),
    defaultValues: {
      showFront: true,
    },
  });

  const createMutation = useCreateKanjiBook({
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  const onSubmit = (data: KanjiBookFormData) => {
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
          <DialogTitle>한자장 생성</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <KanjiBookFormFields
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

