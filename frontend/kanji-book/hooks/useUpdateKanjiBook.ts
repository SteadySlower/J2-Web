"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import {
  updateKanjiBook,
  type UpdateKanjiBookRequest,
} from "@/lib/api/kanji-books/update-book";
import type { KanjiBook } from "@/lib/api/kanji-books/get-all-books";

type UseUpdateKanjiBookOptions = {
  kanjibookId: string;
  onSuccess?: () => void;
};

export function useUpdateKanjiBook({
  kanjibookId,
  onSuccess,
}: UseUpdateKanjiBookOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateKanjiBookRequest) =>
      updateKanjiBook(kanjibookId, data),
    onMutate: async (updatedData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["kanji-books"] });

      // 이전 데이터 백업
      const previousBooks = queryClient.getQueryData<KanjiBook[]>([
        "kanji-books",
      ]);

      // 낙관적 업데이트: 기존 한자장 업데이트
      if (previousBooks) {
        queryClient.setQueryData<KanjiBook[]>(
          ["kanji-books"],
          previousBooks.map((book) =>
            book.id === kanjibookId
              ? {
                  ...book,
                  title: updatedData.title ?? book.title,
                  status: updatedData.status ?? book.status,
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
      queryClient.setQueryData<KanjiBook[]>(["kanji-books"], (old = []) =>
        old.map((book) =>
          book.id === kanjibookId
            ? {
                ...book,
                title: data.title,
                status: data.status as "studying" | "studied",
                showFront: data.showFront,
                updatedAt: DateTime.fromISO(data.updatedAt),
              }
            : book
        )
      );
      toast.success("한자장이 수정되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _updatedData, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousBooks) {
        queryClient.setQueryData(["kanji-books"], context.previousBooks);
      }
      toast.error(error.message || "한자장 수정에 실패했습니다.");
    },
  });
}

