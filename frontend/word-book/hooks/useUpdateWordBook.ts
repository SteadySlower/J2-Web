"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import {
  updateWordBook,
  type UpdateWordBookRequest,
} from "@/lib/api/word-books/update-book";
import type { WordBook } from "@/lib/types/word-books";

type UseUpdateWordBookOptions = {
  wordbookId: string;
  onSuccess?: () => void;
};

export function useUpdateWordBook({
  wordbookId,
  onSuccess,
}: UseUpdateWordBookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWordBookRequest) =>
      updateWordBook(wordbookId, data),
    onMutate: async (updatedData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["word-books"] });

      // 이전 데이터 백업
      const previousBooks = queryClient.getQueryData<WordBook[]>([
        "word-books",
      ]);

      // 낙관적 업데이트: 기존 단어장 업데이트
      if (previousBooks) {
        queryClient.setQueryData<WordBook[]>(
          ["word-books"],
          previousBooks.map((book) =>
            book.id === wordbookId
              ? {
                  ...book,
                  title: updatedData.title ?? book.title,
                  showFront: updatedData.showFront ?? book.showFront,
                  updatedAt: DateTime.now(),
                }
              : book
          )
        );
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousBooks };
    },
    onSuccess: (data) => {
      // 서버 응답으로 실제 데이터로 교체
      queryClient.setQueryData<WordBook[]>(["word-books"], (old = []) =>
        old.map((book) =>
          book.id === wordbookId
            ? {
                ...book,
                title: data.title,
                showFront: data.showFront,
                updatedAt: DateTime.fromISO(data.updatedAt),
              }
            : book
        )
      );
      toast.success("단어장이 수정되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _updatedData, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousBooks) {
        queryClient.setQueryData(["word-books"], context.previousBooks);
      }
      toast.error(error.message || "단어장 수정에 실패했습니다.");
    },
  });
}
