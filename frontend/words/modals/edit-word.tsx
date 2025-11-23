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
import {
  updateWordSchema,
  type UpdateWordRequest,
} from "@/lib/api/words/update-word";
import type { Word } from "@/lib/types/word";
import WordFormFields from "@/frontend/words/components/word-form-fields";
import { useParams } from "next/navigation";
import { useUpdateWord } from "@/frontend/words/hooks/useUpdateWord";

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
  const params = useParams();
  const bookId = params.id as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WordFormData>({
    resolver: zodResolver(updateWordSchema),
    defaultValues: {
      japanese: word.japanese,
      meaning: word.meaning,
      pronunciation: word.pronunciation || "",
    },
  });

  const updateMutation = useUpdateWord({
    wordId: word.id,
    bookId,
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  const onSubmit = (data: WordFormData) => {
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>단어 수정</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <WordFormFields register={register} errors={errors} />
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
      </DialogContent>
    </Dialog>
  );
}
