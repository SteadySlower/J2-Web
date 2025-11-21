"use client";

import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleWordStatus } from "@/lib/api/words/toggle-status";
import type { WordBookDetail } from "@/lib/types/word-books";

type GraduationButtonProps = {
  wordId: string;
  status: "learning" | "learned";
  wordbookId: string;
};

export default function GraduationButton({
  wordId,
  status,
  wordbookId,
}: GraduationButtonProps) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: (newStatus: "learning" | "learned") =>
      toggleWordStatus(wordId, newStatus),
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ["word-books", wordbookId] });

      const previousData = queryClient.getQueryData<WordBookDetail>([
        "word-books",
        wordbookId,
      ]);

      if (previousData) {
        queryClient.setQueryData<WordBookDetail>(["word-books", wordbookId], {
          ...previousData,
          words: previousData.words.map((word) =>
            word.id === wordId ? { ...word, status: newStatus } : word
          ),
        });
      }

      return { previousData };
    },
    onError: (_error, _newStatus, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["word-books", wordbookId],
          context.previousData
        );
      }
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = status === "learning" ? "learned" : "learning";
    toggleMutation.mutate(newStatus);
  };

  return (
    <button
      className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
      onClick={handleClick}
    >
      <GraduationCap
        className={cn(
          "w-8 h-8",
          status === "learned" ? "text-green-500" : "text-gray-300"
        )}
      />
    </button>
  );
}

