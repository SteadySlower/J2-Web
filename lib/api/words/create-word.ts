import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";
import type { KanjiResponse } from "@/lib/api/types/kanji";
import { wordFieldsSchema } from "./word-fields";

export const createWordSchema = wordFieldsSchema.extend({
  bookId: z.string().uuid("단어장 ID는 유효한 UUID 형식이어야 합니다"),
});

export type CreateWordRequest = z.infer<typeof createWordSchema>;

export type CreateWordResponse = {
  id: string;
  book_id: string;
  japanese: string;
  meaning: string;
  pronunciation: string;
  status: "learning" | "learned";
  created_at: string;
  updated_at: string;
  kanjis: KanjiResponse[];
};

export async function createWord(
  data: CreateWordRequest
): Promise<CreateWordResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/words`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      book_id: data.bookId,
      japanese: data.japanese,
      meaning: data.meaning,
      pronunciation: data.pronunciation,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "단어 생성에 실패했습니다.");
    }
    if (response.status === 404) {
      throw new Error("단어장을 찾을 수 없습니다");
    }
    if (response.status === 403) {
      throw new Error("이 단어장에 접근할 권한이 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "단어 생성에 실패했습니다.");
  }

  const result: { data: CreateWordResponse } = await response.json();
  return result.data;
}
