import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";

export const updateKanjiBookSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").optional(),
  status: z.enum(["studying", "studied"]).optional(),
  showFront: z.boolean().optional(),
});

export type UpdateKanjiBookRequest = z.infer<typeof updateKanjiBookSchema>;

type UpdateKanjiBookResponse = {
  id: string;
  userId: string;
  title: string;
  status: string;
  showFront: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function updateKanjiBook(
  id: string,
  data: UpdateKanjiBookRequest
): Promise<UpdateKanjiBookResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/kanji-books/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      status: data.status,
      showFront: data.showFront,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "한자장 수정에 실패했습니다.");
    }
    if (response.status === 404) {
      throw new Error("한자장을 찾을 수 없습니다");
    }
    if (response.status === 403) {
      throw new Error("이 한자장에 접근할 권한이 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "한자장 수정에 실패했습니다.");
  }

  const result: { data: UpdateKanjiBookResponse } = await response.json();
  return result.data;
}

