"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Path, FieldError } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
import {
  createKanjiSchema,
  type CreateKanjiRequest,
} from "@/lib/api/kanjis/create-kanji";
import { useCreateKanji } from "@/frontend/kanjis/hooks/useCreateKanji";
import { useParams } from "next/navigation";
import Form from "@/frontend/core/components/form/form";
import SubmitButton from "@/frontend/core/components/form/submit-button";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import Input from "@/frontend/core/components/form/input";

type KanjiFormData = CreateKanjiRequest;

type CreateKanjiModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
};

export default function CreateKanjiModal({
  isOpen,
  onClose,
  onCreated,
}: CreateKanjiModalProps) {
  const params = useParams();
  const kanjibookId = params.id as string;

  const form = useForm<KanjiFormData>({
    resolver: zodResolver(createKanjiSchema),
    defaultValues: {
      kanji_book_id: kanjibookId,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const createMutation = useCreateKanji({
    bookId: kanjibookId,
    onSuccess: (kanjiId) => {
      onCreated(kanjiId);
      onClose();
      reset();
    },
  });

  const onSubmit = (data: KanjiFormData) => {
    createMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    reset();
    createMutation.reset();
  };

  const characterRegister = register("character" as Path<KanjiFormData>);
  const meaningRegister = register("meaning" as Path<KanjiFormData>);
  const onReadingRegister = register("on_reading" as Path<KanjiFormData>);
  const kunReadingRegister = register("kun_reading" as Path<KanjiFormData>);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="min-h-96">
        <DialogHeader>
          <DialogTitle>한자 추가</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <Input
              label="한자"
              register={characterRegister}
              error={errors.character as FieldError | undefined}
              type="text"
            />
            <Input
              label="의미"
              register={meaningRegister}
              error={errors.meaning as FieldError | undefined}
              type="text"
              maxLength={100}
            />
            <Input
              label="음독"
              register={onReadingRegister}
              error={errors.on_reading as FieldError | undefined}
              type="text"
              maxLength={50}
            />
            <Input
              label="훈독"
              register={kunReadingRegister}
              error={errors.kun_reading as FieldError | undefined}
              type="text"
              maxLength={50}
            />
          </div>
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
