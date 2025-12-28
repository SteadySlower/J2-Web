import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";

export const createKanjiSchema = z.object({
  kanji_book_id: z
    .string()
    .uuid("한자장 ID는 유효한 UUID 형식이어야 합니다")
    .optional(),
  character: z
    .string()
    .min(1, "한자 문자는 필수입니다")
    .max(1, "한자 문자는 최대 1자까지 입력 가능합니다"),
  meaning: z
    .string()
    .min(1, "의미는 필수입니다")
    .max(100, "의미는 최대 100자까지 입력 가능합니다"),
  on_reading: z
    .string()
    .max(50, "음독은 최대 50자까지 입력 가능합니다")
    .optional(),
  kun_reading: z
    .string()
    .max(50, "훈독은 최대 50자까지 입력 가능합니다")
    .optional(),
});

export type CreateKanjiRequest = z.infer<typeof createKanjiSchema>;

export type CreateKanjiResponse = {
  id: string;
  kanji_book_id: string | null;
  character: string;
  meaning: string;
  on_reading: string | null;
  kun_reading: string | null;
  status: "learning" | "learned";
  created_at: string;
  updated_at: string;
};

export async function createKanji(
  data: CreateKanjiRequest
): Promise<CreateKanjiResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/kanjis`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kanji_book_id: data.kanji_book_id,
      character: data.character,
      meaning: data.meaning,
      on_reading: data.on_reading,
      kun_reading: data.kun_reading,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "한자 생성에 실패했습니다.");
    }
    if (response.status === 404) {
      throw new Error("한자장을 찾을 수 없습니다");
    }
    if (response.status === 403) {
      throw new Error("이 한자장에 접근할 권한이 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "한자 생성에 실패했습니다.");
  }

  const result: { data: CreateKanjiResponse } = await response.json();
  return result.data;
}
