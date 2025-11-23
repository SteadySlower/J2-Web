"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleWordStatus } from "@/lib/api/words/toggle-status";
import type { WordBookDetail } from "@/lib/types/word-books";

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
      await queryClient.cancelQueries({ queryKey: ["word-books", bookId] });

      const previousData = queryClient.getQueryData<WordBookDetail>([
        "word-books",
        bookId,
      ]);

      if (previousData) {
        queryClient.setQueryData<WordBookDetail>(["word-books", bookId], {
          ...previousData,
          words: previousData.words.map((word) =>
            word.id === wordId ? { ...word, status: newStatus } : word
          ),
        });
      }

      return { previousData };
    },
    onError: (_error, _newStatus, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["word-books", bookId], context.previousData);
      }
    },
  });
}

