import { getAuthToken } from "@/lib/api/utils/auth";

type RemoveKanjiFromBookResponse = {
  message: string;
};

export async function removeKanjiFromBook(
  bookId: string,
  kanjiId: string
): Promise<RemoveKanjiFromBookResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(
    `${apiBaseUrl}/kanji-books/${bookId}/kanjis/${kanjiId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error || "한자장 또는 한자를 찾을 수 없습니다";
      throw new Error(errorMessage);
    }
    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || "접근 권한이 없습니다";
      throw new Error(errorMessage);
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "한자장에서 한자 제거에 실패했습니다.");
  }

  const result: { data: RemoveKanjiFromBookResponse } = await response.json();
  return result.data;
}
