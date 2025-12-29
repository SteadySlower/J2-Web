"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { removeKanjiFromBook } from "@/lib/api/kanji-books/remove-kanji-from-book";
import type { KanjiBookDetail } from "@/lib/api/kanji-books/get-book-detail";

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

      // 진행 중인 쿼리 취소
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

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: () => {
      toast.success("한자가 한자 노트에서 제거되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _variables, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["kanji-books", bookId],
          context.previousDetail
        );
      }
      toast.error(error.message || "한자장에서 한자 제거에 실패했습니다.");
    },
  });
}
