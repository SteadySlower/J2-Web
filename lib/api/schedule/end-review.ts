import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";
import { DateTime } from "luxon";

export const endReviewSchema = z.object({
  bookId: z.string().uuid("유효한 UUID 형식이어야 합니다"),
  type: z.enum(["word", "kanji"]),
});

export type EndReviewRequest = z.infer<typeof endReviewSchema>;

export async function endReview(data: EndReviewRequest): Promise<void> {
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

  const endpoint =
    data.type === "word"
      ? `${apiBaseUrl}/schedules/word-books/review`
      : `${apiBaseUrl}/schedules/kanji-books/review`;

  const requestBody =
    data.type === "word"
      ? { word_book_id: data.bookId, current_date: currentDate }
      : { kanji_book_id: data.bookId, current_date: currentDate };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.error ||
      (data.type === "word"
        ? "단어장 복습 완료에 실패했습니다."
        : "한자장 복습 완료에 실패했습니다.");
    throw new Error(errorMessage);
  }
}
