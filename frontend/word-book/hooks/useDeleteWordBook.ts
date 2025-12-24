"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteWordBook } from "@/lib/api/word-books/delete-book";
import type { WordBook } from "@/frontend/core/types/word-books";

type UseDeleteWordBookOptions = {
  wordbookId: string;
  onMutate?: () => void;
  onSuccess?: () => void;
};

export function useDeleteWordBook({
  wordbookId,
  onMutate,
  onSuccess,
}: UseDeleteWordBookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteWordBook(wordbookId),
    onMutate: async () => {
      onMutate?.();
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["word-books"] });

      // 이전 데이터 백업
      const previousBooks = queryClient.getQueryData<WordBook[]>([
        "word-books",
      ]);

      // 낙관적 업데이트: 단어장 제거
      if (previousBooks) {
        queryClient.setQueryData<WordBook[]>(
          ["word-books"],
          previousBooks.filter((book) => book.id !== wordbookId)
        );
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousBooks };
    },
    onSuccess: () => {
      toast.success("단어장이 삭제되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _variables, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousBooks) {
        queryClient.setQueryData(["word-books"], context.previousBooks);
      }
      toast.error(error.message || "단어장 삭제에 실패했습니다.");
    },
  });
}
