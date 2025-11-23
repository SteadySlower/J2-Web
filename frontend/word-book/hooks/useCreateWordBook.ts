"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import { createWordBook } from "@/lib/api/word-books/create-book";
import type { WordBook } from "@/lib/types/word-books";

type UseCreateWordBookOptions = {
  onSuccess?: () => void;
};

export function useCreateWordBook({ onSuccess }: UseCreateWordBookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWordBook,
    onMutate: async (newBook) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["word-books"] });

      // 이전 데이터 백업
      const previousBooks = queryClient.getQueryData<WordBook[]>([
        "word-books",
      ]);

      // 낙관적 업데이트: 임시 데이터 추가
      const optimisticBook: WordBook = {
        id: `temp-${Date.now()}`,
        title: newBook.title,
        status: "studying",
        showFront: newBook.showFront ?? true,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      };

      queryClient.setQueryData<WordBook[]>(["word-books"], (old = []) => [
        optimisticBook,
        ...old,
      ]);

      // 롤백을 위한 컨텍스트 반환
      return { previousBooks };
    },
    onSuccess: (data) => {
      // 서버 응답으로 실제 데이터로 교체
      queryClient.setQueryData<WordBook[]>(["word-books"], (old = []) => {
        // 임시 데이터 제거하고 실제 데이터 추가
        const filtered = old.filter((book) => !book.id.startsWith("temp-"));
        return [
          {
            id: data.id,
            title: data.title,
            status: data.status as "studying" | "studied",
            showFront: data.showFront,
            createdAt: DateTime.fromISO(data.createdAt),
            updatedAt: DateTime.fromISO(data.updatedAt),
          },
          ...filtered,
        ];
      });
      toast.success("단어장이 생성되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _newBook, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousBooks) {
        queryClient.setQueryData(["word-books"], context.previousBooks);
      }
      toast.error(error.message || "단어장 생성에 실패했습니다.");
    },
  });
}
