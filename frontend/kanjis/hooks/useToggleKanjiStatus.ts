"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKanji } from "@/lib/api/kanjis/update-kanji";
import type { KanjiBookDetail } from "@/lib/api/kanji-books/get-book-detail";

type UseToggleKanjiStatusOptions = {
  kanjiId: string;
  bookId?: string;
};

export function useToggleKanjiStatus({
  kanjiId,
  bookId,
}: UseToggleKanjiStatusOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newStatus: "learning" | "learned") =>
      updateKanji(kanjiId, { status: newStatus }),
    onMutate: async (newStatus) => {
      if (!bookId) return { previousData: null };

      await queryClient.cancelQueries({ queryKey: ["kanji-books", bookId] });

      const previousData = queryClient.getQueryData<KanjiBookDetail>([
        "kanji-books",
        bookId,
      ]);

      if (previousData) {
        queryClient.setQueryData<KanjiBookDetail>(["kanji-books", bookId], {
          ...previousData,
          kanjis: previousData.kanjis.map((kanji) =>
            kanji.id === kanjiId ? { ...kanji, status: newStatus } : kanji
          ),
        });
      }

      return { previousData };
    },
    onError: (_error, _newStatus, context) => {
      if (!bookId) return;

      if (context?.previousData) {
        queryClient.setQueryData(["kanji-books", bookId], context.previousData);
      }
    },
  });
}

