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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateWord,
  updateWordSchema,
  type UpdateWordRequest,
} from "@/lib/api/words/update-word";
import type { WordBookDetail } from "@/lib/types/word-books";
import type { Word } from "@/lib/types/word";
import WordFormFields from "@/frontend/words/components/word-form-fields";
import { useParams } from "next/navigation";
import { mapWordResponseToWord } from "@/lib/api/utils/word-mapper";

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
  const queryClient = useQueryClient();

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

  const updateMutation = useMutation({
    mutationFn: (data: UpdateWordRequest) => updateWord(word.id, data),
    onMutate: async (updatedData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["word-books", bookId] });

      // 이전 데이터 백업
      const previousDetail = queryClient.getQueryData<WordBookDetail>([
        "word-books",
        bookId,
      ]);

      // 낙관적 업데이트: 기존 단어 업데이트
      if (previousDetail) {
        queryClient.setQueryData<WordBookDetail>(["word-books", bookId], {
          ...previousDetail,
          words: previousDetail.words.map((w) =>
            w.id === word.id
              ? {
                  ...w,
                  japanese: updatedData.japanese ?? w.japanese,
                  meaning: updatedData.meaning ?? w.meaning,
                  pronunciation: updatedData.pronunciation ?? w.pronunciation,
                  updatedAt: DateTime.now(),
                }
              : w
          ),
        });
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: (data) => {
      // 서버 응답으로 실제 데이터로 교체
      queryClient.setQueryData<WordBookDetail>(
        ["word-books", bookId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            words: old.words.map((w) =>
              w.id === word.id ? mapWordResponseToWord(data) : w
            ),
          };
        }
      );
      toast.success("단어가 수정되었습니다!");
      onClose();
      reset();
    },
    onError: (error: Error, _updatedData, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["word-books", bookId],
          context.previousDetail
        );
      }
      toast.error(error.message || "단어 수정에 실패했습니다.");
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
