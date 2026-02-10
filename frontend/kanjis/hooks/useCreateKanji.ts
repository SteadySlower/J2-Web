"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createKanji } from "@/lib/api/kanjis/create-kanji";
import type { KanjiBookDetail } from "@/lib/api/kanji-books/get-book-detail";
import type { Kanji } from "@/frontend/core/types/kanji";

type UseCreateKanjiOptions = {
  bookId?: string;
  onSuccess?: (kanjiId: string) => void;
};

export function useCreateKanji({ bookId, onSuccess }: UseCreateKanjiOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createKanji,
    onMutate: async (newKanji) => {
      if (!bookId) return { previousDetail: null };

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["kanji-books", bookId] });

      // 이전 데이터 백업
      const previousDetail = queryClient.getQueryData<KanjiBookDetail>([
        "kanji-books",
        bookId,
      ]);

      // 낙관적 업데이트: 임시 데이터 추가
      const optimisticKanji: Kanji = {
        id: `temp-${Date.now()}`,
        bookId: bookId,
        character: newKanji.character,
        meaning: newKanji.meaning,
        onReading: newKanji.on_reading ?? null,
        kunReading: newKanji.kun_reading ?? null,
        status: "learning",
      };

      if (previousDetail) {
        queryClient.setQueryData<KanjiBookDetail>(["kanji-books", bookId], {
          ...previousDetail,
          kanjis: [optimisticKanji, ...previousDetail.kanjis],
        });
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: (data) => {
      // 한자장이 없이 한자를 만드는 경우를 대비해서 넣은 코드
      if (!bookId) {
        toast.success("한자가 생성되었습니다!");
        onSuccess?.(data.id);
        return;
      }

      // 서버 응답으로 실제 데이터로 교체
      const currentDetail = queryClient.getQueryData<KanjiBookDetail>([
        "kanji-books",
        bookId,
      ]);

      if (currentDetail) {
        queryClient.setQueryData<KanjiBookDetail>(
          ["kanji-books", bookId],
          (old) => {
            if (!old) return old;
            // 임시 데이터 제거하고 실제 데이터 추가
            const filtered = old.kanjis.filter(
              (kanji) => !kanji.id.startsWith("temp-"),
            );
            const mappedKanji: Kanji = {
              id: data.id,
              bookId: bookId,
              character: data.character,
              meaning: data.meaning,
              onReading: data.on_reading,
              kunReading: data.kun_reading,
              status: data.status,
            };
            return {
              ...old,
              kanjis: [mappedKanji, ...filtered],
            };
          },
        );
      }
      toast.success("한자가 생성되었습니다!");
      onSuccess?.(data.id);
    },
    onError: (error: Error, _newKanji, context) => {
      if (!bookId) {
        toast.error(error.message || "한자 생성에 실패했습니다.");
        return;
      }

      // 롤백: 이전 데이터로 복원
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["kanji-books", bookId],
          context.previousDetail,
        );
      }
      toast.error(error.message || "한자 생성에 실패했습니다.");
    },
  });
}
