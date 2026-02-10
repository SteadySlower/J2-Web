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
import type { Word } from "@/frontend/core/types/word";

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
      // word-books queryKey 취소 및 업데이트
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

      // today-words queryKey 취소 및 업데이트
      await queryClient.cancelQueries({ queryKey: ["today-words"] });

      // 모든 today-words 쿼리를 찾아서 업데이트
      queryClient
        .getQueriesData({ queryKey: ["today-words"] })
        .forEach(([queryKey, data]) => {
          if (data && Array.isArray(data)) {
            queryClient.setQueryData<Word[]>(queryKey, (old) => {
              if (!old) return old;
              return old.map((word) =>
                word.id === wordId
                  ? {
                      ...word,
                      japanese: updatedData.japanese ?? word.japanese,
                      meaning: updatedData.meaning ?? word.meaning,
                      pronunciation:
                        updatedData.pronunciation ?? word.pronunciation,
                      updatedAt: DateTime.now(),
                    }
                  : word
              );
            });
          }
        });

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: (data) => {
      const mappedWord = mapWordResponseToWord(data);
      // 서버 응답으로 실제 데이터로 교체: word-books
      queryClient.setQueryData<WordBookDetail>(
        ["word-books", bookId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            words: old.words.map((w) =>
              w.id === wordId ? mappedWord : w
            ),
          };
        }
      );
      // 서버 응답으로 실제 데이터로 교체: today-words
      queryClient
        .getQueriesData({ queryKey: ["today-words"] })
        .forEach(([queryKey]) => {
          queryClient.setQueryData<Word[]>(queryKey, (old) => {
            if (!old) return old;
            return old.map((word) =>
              word.id === wordId ? mappedWord : word
            );
          });
        });
      toast.success("단어가 수정되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _updatedData, context) => {
      // 롤백: word-books
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["word-books", bookId],
          context.previousDetail
        );
      }
      // today-words는 invalidate로 롤백 (서버에서 다시 가져옴)
      queryClient.invalidateQueries({ queryKey: ["today-words"] });
      toast.error(error.message || "단어 수정에 실패했습니다.");
    },
  });
}
