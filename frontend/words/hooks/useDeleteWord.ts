"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteWord } from "@/lib/api/words/delete-word";
import type { WordBookDetail } from "@/lib/types/word-books";

type UseDeleteWordOptions = {
  wordId: string;
  bookId: string;
  onMutate?: () => void;
  onSuccess?: () => void;
};

export function useDeleteWord({
  wordId,
  bookId,
  onMutate,
  onSuccess,
}: UseDeleteWordOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteWord(wordId),
    onMutate: async () => {
      onMutate?.();
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["word-books", bookId] });

      // 이전 데이터 백업
      const previousDetail = queryClient.getQueryData<WordBookDetail>([
        "word-books",
        bookId,
      ]);

      // 낙관적 업데이트: 단어 제거
      if (previousDetail) {
        queryClient.setQueryData<WordBookDetail>(["word-books", bookId], {
          ...previousDetail,
          words: previousDetail.words.filter((w) => w.id !== wordId),
        });
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: () => {
      toast.success("단어가 삭제되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _variables, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["word-books", bookId],
          context.previousDetail
        );
      }
      toast.error(error.message || "단어 삭제에 실패했습니다.");
    },
  });
}
