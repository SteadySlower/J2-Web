"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import { createKanjiBook } from "@/lib/api/kanji-books/create-book";
import type { KanjiBook } from "@/frontend/core/types/kanji-book";

type UseCreateKanjiBookOptions = {
  onSuccess?: () => void;
};

export function useCreateKanjiBook({ onSuccess }: UseCreateKanjiBookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createKanjiBook,
    onMutate: async (newBook) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["kanji-books"] });

      // 이전 데이터 백업
      const previousBooks = queryClient.getQueryData<KanjiBook[]>([
        "kanji-books",
      ]);

      // 낙관적 업데이트: 임시 데이터 추가
      const optimisticBook: KanjiBook = {
        id: `temp-${Date.now()}`,
        title: newBook.title,
        status: "studying",
        showFront: newBook.showFront ?? true,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      };

      queryClient.setQueryData<KanjiBook[]>(["kanji-books"], (old = []) => [
        optimisticBook,
        ...old,
      ]);

      // 롤백을 위한 컨텍스트 반환
      return { previousBooks };
    },
    onSuccess: (data) => {
      // 서버 응답으로 실제 데이터로 교체
      queryClient.setQueryData<KanjiBook[]>(["kanji-books"], (old = []) => {
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
      toast.success("한자장이 생성되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _newBook, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousBooks) {
        queryClient.setQueryData(["kanji-books"], context.previousBooks);
      }
      toast.error(error.message || "한자장 생성에 실패했습니다.");
    },
  });
}
