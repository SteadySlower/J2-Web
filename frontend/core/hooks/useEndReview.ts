"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  endReview,
  type EndReviewRequest,
} from "@/lib/api/schedule/end-review";

type UseEndReviewOptions = {
  onSuccess?: () => void;
};

export function useEndReview({ onSuccess }: UseEndReviewOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EndReviewRequest) => endReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-books"] });
      toast.success("복습이 완료되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "복습 완료에 실패했습니다.");
    },
  });
}
