"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
  updateKanjiSchema,
  type UpdateKanjiRequest,
} from "@/lib/api/kanjis/update-kanji";
import type { Kanji } from "@/frontend/core/types/kanji";
import type { Path, FieldError } from "react-hook-form";
import Input from "@/frontend/core/components/form/input";
import { useUpdateKanji } from "@/frontend/kanjis/hooks/useUpdateKanji";
import { useRemoveKanjiFromBook } from "@/frontend/kanjis/hooks/useRemoveKanjiFromBook";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@/frontend/core/components/ui/tooltip";

type KanjiFormData = UpdateKanjiRequest;

type EditKanjiModalProps = {
  isOpen: boolean;
  onClose: () => void;
  kanji: Kanji;
};

export default function EditKanjiModal({
  isOpen,
  onClose,
  kanji,
}: EditKanjiModalProps) {
  const params = useParams();
  const bookId = params.id as string | undefined;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<KanjiFormData>({
    resolver: zodResolver(updateKanjiSchema),
    defaultValues: {
      meaning: kanji.meaning,
      on_reading: kanji.onReading || "",
      kun_reading: kanji.kunReading || "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = form;

  const meaningRegister = register("meaning" as Path<KanjiFormData>);
  const onReadingRegister = register("on_reading" as Path<KanjiFormData>);
  const kunReadingRegister = register("kun_reading" as Path<KanjiFormData>);

  const updateMutation = useUpdateKanji({
    kanjiId: kanji.id,
    bookId,
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  const deleteMutation = useRemoveKanjiFromBook({
    bookId: bookId ?? "",
    kanjiId: kanji.id,
    onMutate: () => {
      onClose();
    },
  });

  const onSubmit = (data: KanjiFormData) => {
    if (!isDirty) {
      return;
    }
    updateMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    reset({
      meaning: kanji.meaning,
      on_reading: kanji.onReading || "",
      kun_reading: kanji.kunReading || "",
    });
    updateMutation.reset();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>한자 수정</DialogTitle>
          </DialogHeader>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 flex flex-col gap-2">
              <label className="text-sm font-medium">한자</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-lg font-semibold p-2 border rounded-md bg-muted">
                    {kanji.character}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-red-500">
                  <p>한자는 수정할 수 없습니다.</p>
                  <TooltipArrow className="fill-red-500" />
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-col gap-4">
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
          {bookId && (
            <div className="absolute bottom-8 left-5">
              <DeleteButton onClick={() => setShowDeleteConfirm(true)} />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmAlertDialog
        title="한자 노트에서 삭제"
        description="이 한자가 한자 노트에서 삭제 됩니다. 이 작업은 되돌릴 수 없습니다."
        actionButtonLabel="삭제"
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onActionButtonClicked={() => deleteMutation.mutate()}
      />
    </>
  );
}
