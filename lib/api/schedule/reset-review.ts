import { getAuthToken } from "@/lib/api/utils/auth";
import { DateTime } from "luxon";

type ResetReviewResponse = {
  id: string;
  user_id: string;
  review_date: string;
  word_book_reviews: string[];
  kanji_book_reviews: string[];
  created_at: string;
  updated_at: string;
};

export async function resetReview(): Promise<ResetReviewResponse> {
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

  const response = await fetch(
    `${apiBaseUrl}/schedules/review/reset?current_date=${currentDate}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "복습 기록 초기화에 실패했습니다.");
  }

  const result: { data: ResetReviewResponse } = await response.json();
  return result.data;
}
