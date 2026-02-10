"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  updateKanji,
  type UpdateKanjiRequest,
} from "@/lib/api/kanjis/update-kanji";
import type { KanjiBookDetail } from "@/lib/api/kanji-books/get-book-detail";
import type { Kanji } from "@/frontend/core/types/kanji";

type UseUpdateKanjiOptions = {
  kanjiId: string;
  bookId?: string;
  onSuccess?: () => void;
};

export function useUpdateKanji({
  kanjiId,
  bookId,
  onSuccess,
}: UseUpdateKanjiOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateKanjiRequest) => updateKanji(kanjiId, data),
    onMutate: async (updatedData) => {
      // kanji-books queryKey 취소 및 업데이트
      let previousDetail: KanjiBookDetail | undefined = undefined;
      if (bookId) {
        await queryClient.cancelQueries({ queryKey: ["kanji-books", bookId] });

        // 이전 데이터 백업
        previousDetail = queryClient.getQueryData<KanjiBookDetail>([
          "kanji-books",
          bookId,
        ]);

        // 낙관적 업데이트: 기존 한자 업데이트
        if (previousDetail) {
          queryClient.setQueryData<KanjiBookDetail>(["kanji-books", bookId], {
            ...previousDetail,
            kanjis: previousDetail.kanjis.map((k) =>
              k.id === kanjiId
                ? {
                    ...k,
                    meaning: updatedData.meaning ?? k.meaning,
                    onReading: updatedData.on_reading ?? k.onReading,
                    kunReading: updatedData.kun_reading ?? k.kunReading,
                  }
                : k
            ),
          });
        }
      }

      // today-kanjis queryKey 취소 및 업데이트
      await queryClient.cancelQueries({ queryKey: ["today-kanjis"] });

      // 모든 today-kanjis 쿼리를 찾아서 업데이트
      queryClient
        .getQueriesData({ queryKey: ["today-kanjis"] })
        .forEach(([queryKey, data]) => {
          if (data && Array.isArray(data)) {
            queryClient.setQueryData<Kanji[]>(queryKey, (old) => {
              if (!old) return old;
              return old.map((kanji) =>
                kanji.id === kanjiId
                  ? {
                      ...kanji,
                      meaning: updatedData.meaning ?? kanji.meaning,
                      onReading: updatedData.on_reading ?? kanji.onReading,
                      kunReading: updatedData.kun_reading ?? kanji.kunReading,
                    }
                  : kanji
              );
            });
          }
        });

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: (data) => {
      const mappedKanji: Kanji = {
        id: data.id,
        character: data.character,
        meaning: data.meaning,
        onReading: data.on_reading,
        kunReading: data.kun_reading,
        status: data.status,
      };

      // 서버 응답으로 실제 데이터로 교체: kanji-books
      if (bookId) {
        queryClient.setQueryData<KanjiBookDetail>(
          ["kanji-books", bookId],
          (old) => {
            if (!old) return old;
            return {
              ...old,
              kanjis: old.kanjis.map((k) =>
                k.id === kanjiId ? mappedKanji : k
              ),
            };
          }
        );
      }

      // 서버 응답으로 실제 데이터로 교체: today-kanjis
      queryClient
        .getQueriesData({ queryKey: ["today-kanjis"] })
        .forEach(([queryKey]) => {
          queryClient.setQueryData<Kanji[]>(queryKey, (old) => {
            if (!old) return old;
            return old.map((kanji) =>
              kanji.id === kanjiId ? mappedKanji : kanji
            );
          });
        });

      toast.success("한자가 수정되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _updatedData, context) => {
      // 롤백: kanji-books
      if (bookId && context?.previousDetail) {
        queryClient.setQueryData(
          ["kanji-books", bookId],
          context.previousDetail
        );
      }
      // today-kanjis는 invalidate로 롤백 (서버에서 다시 가져옴)
      queryClient.invalidateQueries({ queryKey: ["today-kanjis"] });
      toast.error(error.message || "한자 수정에 실패했습니다.");
    },
  });
}

