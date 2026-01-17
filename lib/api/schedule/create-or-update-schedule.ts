import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";
import { getCurrentLocalDate } from "@/lib/api/utils/date";
import { DateTime } from "luxon";
import type { Schedule } from "@/frontend/core/types/schedule";

export const createOrUpdateScheduleSchema = z.object({
  studyDays: z
    .number()
    .int()
    .nonnegative("study_days는 0 이상의 정수여야 합니다"),
  reviewDays: z.array(
    z.number().int().positive("review_days의 각 요소는 양의 정수여야 합니다")
  ),
});

export type CreateOrUpdateScheduleRequest = z.infer<
  typeof createOrUpdateScheduleSchema
>;

type ScheduleResponse = {
  id: string;
  study_days: number;
  review_days: number[];
  created_at: string;
  updated_at: string;
};

export async function createOrUpdateSchedule(
  data: CreateOrUpdateScheduleRequest
): Promise<Schedule> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();
  const currentDate = getCurrentLocalDate();

  const response = await fetch(`${apiBaseUrl}/schedules`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      study_days: data.studyDays,
      review_days: data.reviewDays,
      current_date: currentDate,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "스케줄 설정에 실패했습니다.");
  }

  const result: { data: ScheduleResponse } = await response.json();

  return {
    id: result.data.id,
    studyDays: result.data.study_days,
    reviewDays: result.data.review_days,
    createdAt: DateTime.fromISO(result.data.created_at),
    updatedAt: DateTime.fromISO(result.data.updated_at),
  };
}
