"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteKanji } from "@/lib/api/kanjis/delete-kanji";
import type { KanjiBookDetail } from "@/lib/api/kanji-books/get-book-detail";

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

      if (!bookId) return { previousDetail: null };

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["kanji-books", bookId] });

      // 이전 데이터 백업
      const previousDetail = queryClient.getQueryData<KanjiBookDetail>([
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

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: () => {
      toast.success("한자가 삭제되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _variables, context) => {
      if (!bookId) {
        toast.error(error.message || "한자 삭제에 실패했습니다.");
        return;
      }

      // 롤백: 이전 데이터로 복원
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["kanji-books", bookId],
          context.previousDetail
        );
      }
      toast.error(error.message || "한자 삭제에 실패했습니다.");
    },
  });
}

