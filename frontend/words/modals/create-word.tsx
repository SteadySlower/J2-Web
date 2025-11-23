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
import WordFormFields from "@/frontend/words/components/word-form-fields";
import {
  createWordSchema,
  type CreateWordRequest,
} from "@/lib/api/words/create-word";
import { useCreateWord } from "@/frontend/words/hooks/useCreateWord";
import { useParams } from "next/navigation";

type WordFormData = CreateWordRequest;

type CreateWordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
};

export default function CreateWordModal({
  isOpen,
  onClose,
  onCreated,
}: CreateWordModalProps) {
  const params = useParams();
  const bookId = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WordFormData>({
    resolver: zodResolver(createWordSchema),
    defaultValues: {
      bookId,
    },
  });

  const createMutation = useCreateWord({
    bookId,
    onSuccess: (wordId) => {
      onCreated(wordId);
      onClose();
      reset();
    },
  });

  const onSubmit = (data: WordFormData) => {
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
          <DialogTitle>단어 추가</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <WordFormFields register={register} errors={errors} />
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
