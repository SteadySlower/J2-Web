import { DateTime } from "luxon";
import { getAuthToken } from "@/lib/api/utils/auth";
import type { Schedule } from "@/frontend/core/types/schedule";

type ScheduleResponse = {
  id: string;
  study_days: number;
  review_days: number[];
  created_at: string;
  updated_at: string;
};

export async function getSchedule(): Promise<Schedule> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/schedules`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("스케줄을 가져오지 못했습니다.");
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
