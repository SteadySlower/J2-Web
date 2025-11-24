import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  updateWordBook,
  type UpdateWordBookRequest,
} from "@/lib/api/word-books/update-book";
import type { WordBook, WordBookDetail } from "@/lib/types/word-books";

type UseToggleShowFrontOptions = {
  wordbookId: string;
  onSuccess?: () => void;
};

export function useToggleShowFront({
  wordbookId,
  onSuccess,
}: UseToggleShowFrontOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nextShowFront: boolean) =>
      updateWordBook(wordbookId, {
        showFront: nextShowFront,
      } satisfies UpdateWordBookRequest),
    onMutate: async (nextShowFront) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["word-books"] }),
        queryClient.cancelQueries({ queryKey: ["word-books", wordbookId] }),
      ]);

      const previousBooks = queryClient.getQueryData<WordBook[]>([
        "word-books",
      ]);
      const previousDetail = queryClient.getQueryData<WordBookDetail>([
        "word-books",
        wordbookId,
      ]);

      if (previousBooks) {
        queryClient.setQueryData<WordBook[]>(
          ["word-books"],
          previousBooks.map((book) =>
            book.id === wordbookId
              ? { ...book, showFront: nextShowFront }
              : book
          )
        );
      }

      if (previousDetail) {
        queryClient.setQueryData<WordBookDetail>(["word-books", wordbookId], {
          ...previousDetail,
          showFront: nextShowFront,
        });
      }

      return { previousBooks, previousDetail };
    },
    onSuccess: (data, nextShowFront) => {
      queryClient.setQueryData<WordBook[]>(["word-books"], (old = []) =>
        old.map((book) =>
          book.id === wordbookId ? { ...book, showFront: data.showFront } : book
        )
      );

      queryClient.setQueryData<WordBookDetail | undefined>(
        ["word-books", wordbookId],
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
          ? "일본어 제시어가 보이도록 설정했어요"
          : "한국어 제시어가 보이도록 설정했어요"
      );
      onSuccess?.();
    },
    onError: (error: Error, _nextShowFront, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData(["word-books"], context.previousBooks);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["word-books", wordbookId],
          context.previousDetail
        );
      }
      toast.error(error.message || "showFront 설정에 실패했습니다.");
    },
  });
}
