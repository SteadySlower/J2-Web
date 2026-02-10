"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteWord } from "@/lib/api/words/delete-word";
import type { WordBookDetail } from "@/frontend/core/types/word-books";
import type { Word } from "@/frontend/core/types/word";

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
      // word-books queryKey 취소 및 업데이트
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

      // today-words queryKey 취소 및 업데이트
      await queryClient.cancelQueries({ queryKey: ["today-words"] });

      // 모든 today-words 쿼리를 찾아서 업데이트
      queryClient
        .getQueriesData({ queryKey: ["today-words"] })
        .forEach(([queryKey, data]) => {
          if (data && Array.isArray(data)) {
            queryClient.setQueryData<Word[]>(queryKey, (old) => {
              if (!old) return old;
              return old.filter((word) => word.id !== wordId);
            });
          }
        });

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: () => {
      toast.success("단어가 삭제되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _variables, context) => {
      // 롤백: word-books
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["word-books", bookId],
          context.previousDetail
        );
      }
      // today-words는 invalidate로 롤백 (서버에서 다시 가져옴)
      queryClient.invalidateQueries({ queryKey: ["today-words"] });
      toast.error(error.message || "단어 삭제에 실패했습니다.");
    },
  });
}
