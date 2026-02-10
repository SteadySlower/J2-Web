"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { removeKanjiFromBook } from "@/lib/api/kanji-books/remove-kanji-from-book";
import type { KanjiBookDetail } from "@/lib/api/kanji-books/get-book-detail";
import type { Kanji } from "@/frontend/core/types/kanji";

type UseRemoveKanjiFromBookOptions = {
  bookId: string;
  kanjiId: string;
  onMutate?: () => void;
  onSuccess?: () => void;
};

export function useRemoveKanjiFromBook({
  bookId,
  kanjiId,
  onMutate,
  onSuccess,
}: UseRemoveKanjiFromBookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeKanjiFromBook(bookId, kanjiId),
    onMutate: async () => {
      onMutate?.();

      // kanji-books queryKey 취소 및 업데이트
      await queryClient.cancelQueries({ queryKey: ["kanji-books", bookId] });

      // 이전 데이터 백업
      const previousDetail = queryClient.getQueryData<KanjiBookDetail>([
        "kanji-books",
        bookId,
      ]);

      // 낙관적 업데이트: 한자장에서 한자 제거
      if (previousDetail) {
        queryClient.setQueryData<KanjiBookDetail>(["kanji-books", bookId], {
          ...previousDetail,
          kanjis: previousDetail.kanjis.filter((k) => k.id !== kanjiId),
        });
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
              return old.filter((kanji) => kanji.id !== kanjiId);
            });
          }
        });

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: () => {
      toast.success("한자가 한자 노트에서 제거되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _variables, context) => {
      // 롤백: kanji-books
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["kanji-books", bookId],
          context.previousDetail
        );
      }
      // today-kanjis는 invalidate로 롤백 (서버에서 다시 가져옴)
      queryClient.invalidateQueries({ queryKey: ["today-kanjis"] });
      toast.error(error.message || "한자장에서 한자 제거에 실패했습니다.");
    },
  });
}
