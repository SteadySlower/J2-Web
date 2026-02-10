"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteKanji } from "@/lib/api/kanjis/delete-kanji";
import type { KanjiBookDetail } from "@/lib/api/kanji-books/get-book-detail";
import type { Kanji } from "@/frontend/core/types/kanji";

type UseDeleteKanjiOptions = {
  kanjiId: string;
  bookId?: string;
  onMutate?: () => void;
  onSuccess?: () => void;
};

export function useDeleteKanji({
  kanjiId,
  bookId,
  onMutate,
  onSuccess,
}: UseDeleteKanjiOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteKanji(kanjiId),
    onMutate: async () => {
      onMutate?.();

      // kanji-books queryKey 취소 및 업데이트
      let previousDetail: KanjiBookDetail | undefined = undefined;
      if (bookId) {
        await queryClient.cancelQueries({ queryKey: ["kanji-books", bookId] });

        // 이전 데이터 백업
        previousDetail = queryClient.getQueryData<KanjiBookDetail>([
          "kanji-books",
          bookId,
        ]);

        // 낙관적 업데이트: 한자 제거
        if (previousDetail) {
          queryClient.setQueryData<KanjiBookDetail>(["kanji-books", bookId], {
            ...previousDetail,
            kanjis: previousDetail.kanjis.filter((k) => k.id !== kanjiId),
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
              return old.filter((kanji) => kanji.id !== kanjiId);
            });
          }
        });

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: () => {
      toast.success("한자가 삭제되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _variables, context) => {
      // 롤백: kanji-books
      if (bookId && context?.previousDetail) {
        queryClient.setQueryData(
          ["kanji-books", bookId],
          context.previousDetail,
        );
      }
      // today-kanjis는 invalidate로 롤백 (서버에서 다시 가져옴)
      queryClient.invalidateQueries({ queryKey: ["today-kanjis"] });
      toast.error(error.message || "한자 삭제에 실패했습니다.");
    },
  });
}
