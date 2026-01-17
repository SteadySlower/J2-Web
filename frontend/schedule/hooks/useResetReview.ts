"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { resetReview } from "@/lib/api/schedule/reset-review";

type UseResetReviewOptions = {
  onSuccess?: () => void;
};

export function useResetReview({ onSuccess }: UseResetReviewOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-books"] });
      toast.success("복습 기록이 초기화되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "복습 기록 초기화에 실패했습니다.");
    },
  });
}
