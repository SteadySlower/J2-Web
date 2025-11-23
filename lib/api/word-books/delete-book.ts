import { getAuthToken } from "@/lib/api/utils/auth";

type DeleteWordBookResponse = {
  message: string;
};

export async function deleteWordBook(
  id: string
): Promise<DeleteWordBookResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/word-books/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("단어장을 찾을 수 없습니다");
    }
    if (response.status === 403) {
      throw new Error("이 단어장에 접근할 권한이 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "단어장 삭제에 실패했습니다.");
  }

  const result: { data: DeleteWordBookResponse } = await response.json();
  return result.data;
}
