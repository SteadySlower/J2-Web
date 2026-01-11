"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createOrUpdateSchedule } from "@/lib/api/schedule/create-or-update-schedule";

type UseCreateOrUpdateScheduleOptions = {
  onSuccess?: () => void;
};

export function useCreateOrUpdateSchedule({
  onSuccess,
}: UseCreateOrUpdateScheduleOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrUpdateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({ queryKey: ["scheduled-books"] });
      toast.success("스케줄이 저장되었습니다!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "스케줄 저장에 실패했습니다.");
    },
  });
}
