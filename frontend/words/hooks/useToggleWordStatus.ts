"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleWordStatus } from "@/lib/api/words/toggle-status";
import type { WordBookDetail } from "@/frontend/core/types/word-books";
import type { Word } from "@/frontend/core/types/word";

type UseToggleWordStatusOptions = {
  wordId: string;
  bookId: string;
};

export function useToggleWordStatus({
  wordId,
  bookId,
}: UseToggleWordStatusOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newStatus: "learning" | "learned") =>
      toggleWordStatus(wordId, newStatus),
    onMutate: async (newStatus) => {
      // word-books queryKey 취소 및 업데이트
      await queryClient.cancelQueries({ queryKey: ["word-books", bookId] });

      const previousWordBookData = queryClient.getQueryData<WordBookDetail>([
        "word-books",
        bookId,
      ]);

      if (previousWordBookData) {
        queryClient.setQueryData<WordBookDetail>(["word-books", bookId], {
          ...previousWordBookData,
          words: previousWordBookData.words.map((word) =>
            word.id === wordId ? { ...word, status: newStatus } : word,
          ),
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
              return old.map((word) =>
                word.id === wordId ? { ...word, status: newStatus } : word,
              );
            });
          }
        });

      return { previousWordBookData };
    },
    onError: (_error, _newStatus, context) => {
      // 롤백: word-books
      if (context?.previousWordBookData) {
        queryClient.setQueryData(
          ["word-books", bookId],
          context.previousWordBookData,
        );
      }
      // today-words는 invalidate로 롤백 (서버에서 다시 가져옴)
      queryClient.invalidateQueries({ queryKey: ["today-words"] });
    },
  });
}
