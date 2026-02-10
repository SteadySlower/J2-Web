"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import { createWord } from "@/lib/api/words/create-word";
import type { WordBookDetail } from "@/frontend/core/types/word-books";
import type { Word } from "@/frontend/core/types/word";
import { mapWordResponseToWord } from "@/lib/api/utils/word-mapper";

type UseCreateWordOptions = {
  bookId: string;
  onSuccess?: (wordId: string) => void;
};

export function useCreateWord({ bookId, onSuccess }: UseCreateWordOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWord,
    onMutate: async (newWord) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["word-books", bookId] });

      // 이전 데이터 백업
      const previousDetail = queryClient.getQueryData<WordBookDetail>([
        "word-books",
        bookId,
      ]);

      // 낙관적 업데이트: 임시 데이터 추가
      const optimisticWord: Word = {
        id: `temp-${Date.now()}`,
        bookId: bookId,
        japanese: newWord.japanese,
        meaning: newWord.meaning,
        pronunciation: newWord.pronunciation || "",
        status: "learning",
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        kanjis: [],
      };

      if (previousDetail) {
        queryClient.setQueryData<WordBookDetail>(["word-books", bookId], {
          ...previousDetail,
          words: [optimisticWord, ...previousDetail.words],
        });
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: (data) => {
      // 서버 응답으로 실제 데이터로 교체
      const currentDetail = queryClient.getQueryData<WordBookDetail>([
        "word-books",
        bookId,
      ]);

      if (currentDetail) {
        queryClient.setQueryData<WordBookDetail>(
          ["word-books", bookId],
          (old) => {
            if (!old) return old;
            // 임시 데이터 제거하고 실제 데이터 추가
            const filtered = old.words.filter(
              (word) => !word.id.startsWith("temp-"),
            );
            return {
              ...old,
              words: [mapWordResponseToWord(data), ...filtered],
            };
          },
        );
      }
      toast.success("단어가 생성되었습니다!");
      onSuccess?.(data.id);
    },
    onError: (error: Error, _newWord, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["word-books", bookId],
          context.previousDetail,
        );
      }
      toast.error(error.message || "단어 생성에 실패했습니다.");
    },
  });
}
