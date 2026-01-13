import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";

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

  const endpoint =
    data.type === "word"
      ? `${apiBaseUrl}/schedules/word-books/review`
      : `${apiBaseUrl}/schedules/kanji-books/review`;

  const requestBody =
    data.type === "word"
      ? { word_book_id: data.bookId }
      : { kanji_book_id: data.bookId };

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
