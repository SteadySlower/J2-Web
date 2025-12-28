import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";

export const updateKanjiSchema = z.object({
  kanji_book_id: z.string().uuid("한자장 ID는 유효한 UUID 형식이어야 합니다").nullable().optional(),
  meaning: z.string().min(1, "의미는 최소 1자 이상이어야 합니다").optional(),
  on_reading: z.string().nullable().optional(),
  kun_reading: z.string().nullable().optional(),
  status: z.enum(["learning", "learned"]).optional(),
});

export type UpdateKanjiRequest = z.infer<typeof updateKanjiSchema>;

export type UpdateKanjiResponse = {
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

export async function updateKanji(
  id: string,
  data: UpdateKanjiRequest
): Promise<UpdateKanjiResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/kanjis/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kanji_book_id: data.kanji_book_id,
      meaning: data.meaning,
      on_reading: data.on_reading,
      kun_reading: data.kun_reading,
      status: data.status,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "한자 수정에 실패했습니다.");
    }
    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error?.includes("한자장")) {
        throw new Error("한자장을 찾을 수 없습니다");
      }
      throw new Error("한자를 찾을 수 없습니다");
    }
    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error?.includes("한자장")) {
        throw new Error("이 한자장에 접근할 권한이 없습니다");
      }
      throw new Error("이 한자에 접근할 권한이 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "한자 수정에 실패했습니다.");
  }

  const result: { data: UpdateKanjiResponse } = await response.json();
  return result.data;
}

