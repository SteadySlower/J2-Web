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
import WordFormFields from "@/frontend/words/components/word-form-fields";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createWord,
  createWordSchema,
  type CreateWordRequest,
} from "@/lib/api/words/create-word";
import type { WordBookDetail } from "@/lib/types/word-books";
import type { Word } from "@/lib/types/word";
import { mapWordResponseToWord } from "@/lib/api/utils/word-mapper";
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
  const queryClient = useQueryClient();

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

  const createMutation = useMutation({
    mutationFn: createWord,
    onMutate: async (newWord) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["word-books", bookId] });

      // 이전 데이터 백업
      const previousDetail = queryClient.getQueryData<WordBookDetail>([
        "word-books",
        bookId,
      ]);

      // 낙관적 업데이트: 임시 데이터 추가
      const optimisticWord: Word = {
        id: `temp-${Date.now()}`,
        japanese: newWord.japanese,
        meaning: newWord.meaning,
        pronunciation: newWord.pronunciation || "",
        status: "learning",
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        kanjis: [],
      };

      if (previousDetail) {
        queryClient.setQueryData<WordBookDetail>(["word-books", bookId], {
          ...previousDetail,
          words: [optimisticWord, ...previousDetail.words],
        });
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: (data) => {
      // 서버 응답으로 실제 데이터로 교체
      const currentDetail = queryClient.getQueryData<WordBookDetail>([
        "word-books",
        bookId,
      ]);

      if (currentDetail) {
        queryClient.setQueryData<WordBookDetail>(
          ["word-books", bookId],
          (old) => {
            if (!old) return old;
            // 임시 데이터 제거하고 실제 데이터 추가
            const filtered = old.words.filter(
              (word) => !word.id.startsWith("temp-")
            );
            return {
              ...old,
              words: [mapWordResponseToWord(data), ...filtered],
            };
          }
        );
      }
      toast.success("단어가 생성되었습니다!");
      onCreated(data.id);
      onClose();
      reset();
    },
    onError: (error: Error, _newWord, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["word-books", bookId],
          context.previousDetail
        );
      }
      toast.error(error.message || "단어 생성에 실패했습니다.");
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
