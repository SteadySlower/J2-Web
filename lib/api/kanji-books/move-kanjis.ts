import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";

export const moveKanjisSchema = z.object({
  target_book_id: z.string().uuid("타겟 한자장 ID는 유효한 UUID 형식이어야 합니다"),
  kanji_ids: z
    .array(z.string().uuid("한자 ID는 유효한 UUID 형식이어야 합니다"))
    .min(1, "최소 1개 이상의 한자를 선택해야 합니다"),
});

export type MoveKanjisRequest = z.infer<typeof moveKanjisSchema>;

type MoveKanjisResponse = {
  message: string;
  moved_count: number;
};

export async function moveKanjis(
  sourceBookId: string,
  data: MoveKanjisRequest
): Promise<MoveKanjisResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(
    `${apiBaseUrl}/kanji-books/${sourceBookId}/move-kanjis`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target_book_id: data.target_book_id,
        kanji_ids: data.kanji_ids,
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "한자 이동에 실패했습니다.");
    }
    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error || "한자장 또는 한자를 찾을 수 없습니다";
      throw new Error(errorMessage);
    }
    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || "접근 권한이 없습니다";
      throw new Error(errorMessage);
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "한자 이동에 실패했습니다.");
  }

  const result: { data: MoveKanjisResponse } = await response.json();
  return result.data;
}
