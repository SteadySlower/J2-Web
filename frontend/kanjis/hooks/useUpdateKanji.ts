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
      if (!bookId) return { previousDetail: null };

      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["kanji-books", bookId] });

      // 이전 데이터 백업
      const previousDetail = queryClient.getQueryData<KanjiBookDetail>([
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

      // 롤백을 위한 컨텍스트 반환
      return { previousDetail };
    },
    onSuccess: (data) => {
      if (!bookId) {
        toast.success("한자가 수정되었습니다!");
        onSuccess?.();
        return;
      }

      // 서버 응답으로 실제 데이터로 교체
      queryClient.setQueryData<KanjiBookDetail>(
        ["kanji-books", bookId],
        (old) => {
          if (!old) return old;
          const mappedKanji: Kanji = {
            id: data.id,
            character: data.character,
            meaning: data.meaning,
            onReading: data.on_reading,
            kunReading: data.kun_reading,
            status: data.status,
          };
          return {
            ...old,
            kanjis: old.kanjis.map((k) =>
              k.id === kanjiId ? mappedKanji : k
            ),
          };
        }
      );
      toast.success("한자가 수정되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error, _updatedData, context) => {
      if (!bookId) {
        toast.error(error.message || "한자 수정에 실패했습니다.");
        return;
      }

      // 롤백: 이전 데이터로 복원
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["kanji-books", bookId],
          context.previousDetail
        );
      }
      toast.error(error.message || "한자 수정에 실패했습니다.");
    },
  });
}

