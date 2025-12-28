import { getAuthToken } from "@/lib/api/utils/auth";

type DeleteKanjiBookResponse = {
  message: string;
};

export async function deleteKanjiBook(
  id: string
): Promise<DeleteKanjiBookResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/kanji-books/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("한자장을 찾을 수 없습니다");
    }
    if (response.status === 403) {
      throw new Error("이 한자장에 접근할 권한이 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "한자장 삭제에 실패했습니다.");
  }

  const result: { data: DeleteKanjiBookResponse } = await response.json();
  return result.data;
}

