import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";

export const updateWordBookSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").optional(),
  showFront: z.boolean().optional(),
});

export type UpdateWordBookRequest = z.infer<typeof updateWordBookSchema>;

type UpdateWordBookResponse = {
  id: string;
  userId: string;
  title: string;
  status: string;
  showFront: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function updateWordBook(
  id: string,
  data: UpdateWordBookRequest
): Promise<UpdateWordBookResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/word-books/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      showFront: data.showFront,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "단어장 수정에 실패했습니다.");
    }
    if (response.status === 404) {
      throw new Error("단어장을 찾을 수 없습니다");
    }
    if (response.status === 403) {
      throw new Error("이 단어장에 접근할 권한이 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "단어장 수정에 실패했습니다.");
  }

  const result: { data: UpdateWordBookResponse } = await response.json();
  return result.data;
}

