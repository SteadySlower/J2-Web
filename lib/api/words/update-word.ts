import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";
import type { KanjiResponse } from "@/lib/api/types/kanji";
import { wordFieldsSchema } from "./word-fields";

export const updateWordSchema = wordFieldsSchema.partial();

export type UpdateWordRequest = z.infer<typeof updateWordSchema>;

export type UpdateWordResponse = {
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

export async function updateWord(
  id: string,
  data: UpdateWordRequest
): Promise<UpdateWordResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/words/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      japanese: data.japanese,
      meaning: data.meaning,
      pronunciation: data.pronunciation,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "단어 수정에 실패했습니다.");
    }
    if (response.status === 404) {
      throw new Error("단어를 찾을 수 없습니다");
    }
    if (response.status === 403) {
      throw new Error("이 단어에 접근할 권한이 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "단어 수정에 실패했습니다.");
  }

  const result: { data: UpdateWordResponse } = await response.json();
  return result.data;
}
