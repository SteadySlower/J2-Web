import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  updateKanjiBook,
  type UpdateKanjiBookRequest,
} from "@/lib/api/kanji-books/update-book";
import type { KanjiBook } from "@/lib/api/kanji-books/get-all-books";
import type { KanjiBookDetail } from "@/lib/api/kanji-books/get-book-detail";

type UseToggleShowFrontOptions = {
  kanjibookId: string;
  onSuccess?: () => void;
};

export function useToggleShowFront({
  kanjibookId,
  onSuccess,
}: UseToggleShowFrontOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nextShowFront: boolean) =>
      updateKanjiBook(kanjibookId, {
        showFront: nextShowFront,
      } satisfies UpdateKanjiBookRequest),
    onMutate: async (nextShowFront) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["kanji-books"] }),
        queryClient.cancelQueries({ queryKey: ["kanji-books", kanjibookId] }),
      ]);

      const previousBooks = queryClient.getQueryData<KanjiBook[]>([
        "kanji-books",
      ]);
      const previousDetail = queryClient.getQueryData<KanjiBookDetail>([
        "kanji-books",
        kanjibookId,
      ]);

      if (previousBooks) {
        queryClient.setQueryData<KanjiBook[]>(
          ["kanji-books"],
          previousBooks.map((book) =>
            book.id === kanjibookId
              ? { ...book, showFront: nextShowFront }
              : book
          )
        );
      }

      if (previousDetail) {
        queryClient.setQueryData<KanjiBookDetail>(
          ["kanji-books", kanjibookId],
          {
            ...previousDetail,
            showFront: nextShowFront,
          }
        );
      }

      return { previousBooks, previousDetail };
    },
    onSuccess: (data, nextShowFront) => {
      queryClient.setQueryData<KanjiBook[]>(["kanji-books"], (old = []) =>
        old.map((book) =>
          book.id === kanjibookId
            ? { ...book, showFront: data.showFront }
            : book
        )
      );

      queryClient.setQueryData<KanjiBookDetail | undefined>(
        ["kanji-books", kanjibookId],
        (old) =>
          old
            ? {
                ...old,
                showFront: data.showFront,
              }
            : old
      );

      toast.success(
        nextShowFront
          ? "한자 제시어가 보이도록 설정했어요"
          : "의미 제시어가 보이도록 설정했어요"
      );
      onSuccess?.();
    },
    onError: (error: Error, _nextShowFront, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(["kanji-books"], context.previousBooks);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["kanji-books", kanjibookId],
          context.previousDetail
        );
      }
      toast.error(error.message || "showFront 설정에 실패했습니다.");
    },
  });
}
