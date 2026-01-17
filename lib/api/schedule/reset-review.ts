import { getAuthToken } from "@/lib/api/utils/auth";
import { getCurrentLocalDate } from "@/lib/api/utils/date";

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
  const currentDate = getCurrentLocalDate();

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
