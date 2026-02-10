"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKanji } from "@/lib/api/kanjis/update-kanji";
import type { KanjiBookDetail } from "@/lib/api/kanji-books/get-book-detail";
import type { Kanji } from "@/frontend/core/types/kanji";

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
      // kanji-books queryKey 취소 및 업데이트
      let previousKanjiBookData: KanjiBookDetail | undefined = undefined;
      if (bookId) {
        await queryClient.cancelQueries({ queryKey: ["kanji-books", bookId] });

        previousKanjiBookData = queryClient.getQueryData<KanjiBookDetail>([
          "kanji-books",
          bookId,
        ]);

        if (previousKanjiBookData) {
          queryClient.setQueryData<KanjiBookDetail>(["kanji-books", bookId], {
            ...previousKanjiBookData,
            kanjis: previousKanjiBookData.kanjis.map((kanji) =>
              kanji.id === kanjiId ? { ...kanji, status: newStatus } : kanji,
            ),
          });
        }
      }

      // today-kanjis queryKey 취소 및 업데이트
      await queryClient.cancelQueries({ queryKey: ["today-kanjis"] });

      // 모든 today-kanjis 쿼리를 찾아서 업데이트
      queryClient
        .getQueriesData({ queryKey: ["today-kanjis"] })
        .forEach(([queryKey, data]) => {
          if (data && Array.isArray(data)) {
            queryClient.setQueryData<Kanji[]>(queryKey, (old) => {
              if (!old) return old;
              return old.map((kanji) =>
                kanji.id === kanjiId ? { ...kanji, status: newStatus } : kanji,
              );
            });
          }
        });

      return { previousKanjiBookData };
    },
    onError: (_error, _newStatus, context) => {
      // 롤백: kanji-books
      if (bookId && context?.previousKanjiBookData) {
        queryClient.setQueryData(
          ["kanji-books", bookId],
          context.previousKanjiBookData,
        );
      }
      // today-kanjis는 invalidate로 롤백 (서버에서 다시 가져옴)
      queryClient.invalidateQueries({ queryKey: ["today-kanjis"] });
    },
  });
}
