"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/frontend/core/components/delete-button";
import {
  updateWordBook,
  updateWordBookSchema,
  type UpdateWordBookRequest,
} from "@/lib/api/word-books/update-book";
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
  const queryClient = useQueryClient();

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

  const updateMutation = useMutation({
    mutationFn: (data: UpdateWordBookRequest) =>
      updateWordBook(wordbook.id, data),
    onMutate: async (updatedData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["word-books"] });

      // 이전 데이터 백업
      const previousBooks = queryClient.getQueryData<WordBook[]>([
        "word-books",
      ]);

      // 낙관적 업데이트: 기존 단어장 업데이트
      if (previousBooks) {
        queryClient.setQueryData<WordBook[]>(
          ["word-books"],
          previousBooks.map((book) =>
            book.id === wordbook.id
              ? {
                  ...book,
                  title: updatedData.title ?? book.title,
                  showFront: updatedData.showFront ?? book.showFront,
                  updatedAt: DateTime.now(),
                }
              : book
          )
        );
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousBooks };
    },
    onSuccess: (data) => {
      // 서버 응답으로 실제 데이터로 교체
      queryClient.setQueryData<WordBook[]>(["word-books"], (old = []) =>
        old.map((book) =>
          book.id === wordbook.id
            ? {
                ...book,
                title: data.title,
                showFront: data.showFront,
                updatedAt: DateTime.fromISO(data.updatedAt),
              }
            : book
        )
      );
      toast.success("단어장이 수정되었습니다!");
      onClose();
      reset();
    },
    onError: (error: Error, _updatedData, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousBooks) {
        queryClient.setQueryData(["word-books"], context.previousBooks);
      }
      toast.error(error.message || "단어장 수정에 실패했습니다.");
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
