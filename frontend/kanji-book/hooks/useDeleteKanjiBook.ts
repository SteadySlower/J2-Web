"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteKanjiBook } from "@/lib/api/kanji-books/delete-book";
import type { KanjiBook } from "@/frontend/core/types/kanji-book";

type UseDeleteKanjiBookOptions = {
  kanjibookId: string;
  onMutate?: () => void;
  onSuccess?: () => void;
};

export function useDeleteKanjiBook({
  kanjibookId,
  onMutate,
  onSuccess,
}: UseDeleteKanjiBookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteKanjiBook(kanjibookId),
    onMutate: async () => {
      onMutate?.();
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["kanji-books"] });

      // 이전 데이터 백업
      const previousBooks = queryClient.getQueryData<KanjiBook[]>([
        "kanji-books",
      ]);

      // 낙관적 업데이트: 한자장 제거
      if (previousBooks) {
        queryClient.setQueryData<KanjiBook[]>(
          ["kanji-books"],
          previousBooks.filter((book) => book.id !== kanjibookId)
        );
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousBooks };
    },
    onSuccess: () => {
      toast.success("한자장이 삭제되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _variables, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousBooks) {
        queryClient.setQueryData(["kanji-books"], context.previousBooks);
      }
      toast.error(error.message || "한자장 삭제에 실패했습니다.");
    },
  });
}
