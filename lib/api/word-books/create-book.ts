import { z } from "zod";
import { getAuthToken } from "@/lib/api/utils/auth";
import { DateTime } from "luxon";

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
  // 클라이언트의 로컬 타임존 기준 현재 날짜를 YYYY-MM-DD 형식으로 가져옵니다
  // 이 함수는 클라이언트 컴포넌트에서만 호출되므로 브라우저의 로컬 타임존을 사용합니다
  const currentDate = DateTime.now().toISODate();
  if (!currentDate) {
    throw new Error("현재 날짜를 가져올 수 없습니다.");
  }

  const response = await fetch(`${apiBaseUrl}/word-books`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      showFront: data.showFront ?? true,
      created_date: currentDate,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "단어장 생성에 실패했습니다.");
  }

  const result: { data: CreateWordBookResponse } = await response.json();
  return result.data;
}
