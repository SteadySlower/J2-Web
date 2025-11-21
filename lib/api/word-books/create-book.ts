import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";

export const createWordBookSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  showFront: z.boolean(),
});

export type CreateWordBookRequest = z.infer<typeof createWordBookSchema>;

type CreateWordBookResponse = {
  id: string;
  userId: string;
  title: string;
  status: string;
  showFront: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function createWordBook(
  data: CreateWordBookRequest
): Promise<CreateWordBookResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/word-books`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      showFront: data.showFront ?? true,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "단어장 생성에 실패했습니다.");
  }

  const result: { data: CreateWordBookResponse } = await response.json();
  return result.data;
}
