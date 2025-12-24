"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import {
  updateWord,
  type UpdateWordRequest,
} from "@/lib/api/words/update-word";
import type { WordBookDetail } from "@/frontend/core/types/word-books";
import { mapWordResponseToWord } from "@/lib/api/utils/word-mapper";

type UseUpdateWordOptions = {
  wordId: string;
  bookId: string;
  onSuccess?: () => void;
};

export function useUpdateWord({
  wordId,
  bookId,
  onSuccess,
}: UseUpdateWordOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWordRequest) => updateWord(wordId, data),
    onMutate: async (updatedData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["word-books", bookId] });

      // 이전 데이터 백업
      const previousDetail = queryClient.getQueryData<WordBookDetail>([
        "word-books",
        bookId,
      ]);

      // 낙관적 업데이트: 기존 단어 업데이트
      if (previousDetail) {
        queryClient.setQueryData<WordBookDetail>(["word-books", bookId], {
          ...previousDetail,
          words: previousDetail.words.map((w) =>
            w.id === wordId
              ? {
                  ...w,
                  japanese: updatedData.japanese ?? w.japanese,
                  meaning: updatedData.meaning ?? w.meaning,
                  pronunciation: updatedData.pronunciation ?? w.pronunciation,
                  updatedAt: DateTime.now(),
                }
              : w
          ),
        });
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: (data) => {
      // 서버 응답으로 실제 데이터로 교체
      queryClient.setQueryData<WordBookDetail>(
        ["word-books", bookId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            words: old.words.map((w) =>
              w.id === wordId ? mapWordResponseToWord(data) : w
            ),
          };
        }
      );
      toast.success("단어가 수정되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _updatedData, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["word-books", bookId],
          context.previousDetail
        );
      }
      toast.error(error.message || "단어 수정에 실패했습니다.");
    },
  });
}
