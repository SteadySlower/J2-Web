import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";
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
  // 클라이언트의 로컬 타임존 기준 현재 날짜를 YYYY-MM-DD 형식으로 가져옵니다
  // 이 함수는 클라이언트 컴포넌트에서만 호출되므로 브라우저의 로컬 타임존을 사용합니다
  const currentDate = DateTime.now().toISODate();
  if (!currentDate) {
    throw new Error("현재 날짜를 가져올 수 없습니다.");
  }

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
