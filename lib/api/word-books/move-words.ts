import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";

export const moveWordsSchema = z.object({
  target_book_id: z.string().uuid("타겟 단어장 ID는 유효한 UUID 형식이어야 합니다"),
  word_ids: z
    .array(z.string().uuid("단어 ID는 유효한 UUID 형식이어야 합니다"))
    .min(1, "최소 1개 이상의 단어를 선택해야 합니다"),
});

export type MoveWordsRequest = z.infer<typeof moveWordsSchema>;

type MoveWordsResponse = {
  message: string;
  moved_count: number;
};

export async function moveWords(
  sourceBookId: string,
  data: MoveWordsRequest
): Promise<MoveWordsResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(
    `${apiBaseUrl}/word-books/${sourceBookId}/move-words`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target_book_id: data.target_book_id,
        word_ids: data.word_ids,
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "단어 이동에 실패했습니다.");
    }
    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error || "단어장 또는 단어를 찾을 수 없습니다";
      throw new Error(errorMessage);
    }
    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || "접근 권한이 없습니다";
      throw new Error(errorMessage);
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "단어 이동에 실패했습니다.");
  }

  const result: { data: MoveWordsResponse } = await response.json();
  return result.data;
}
