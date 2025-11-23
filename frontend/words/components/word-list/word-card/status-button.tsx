"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toggleWordStatus } from "@/lib/api/words/toggle-status";
import type { WordBookDetail } from "@/lib/types/word-books";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";

type StatusButtonProps = {
  wordId: string;
  status: "learning" | "learned";
};

export default function StatusButton({ wordId, status }: StatusButtonProps) {
  const params = useParams();
  const wordbookId = params.id as string;
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

  const tooltipText = status === "learning" ? "완료 체크" : "체크 취소";

  const button = (
    <button
      className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
      onClick={handleClick}
    >
      <Check
        className={cn(
          "w-8 h-8",
          status === "learned" ? "text-green-500" : "text-gray-300"
        )}
      />
    </button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">
        <p>{tooltipText}</p>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
}
