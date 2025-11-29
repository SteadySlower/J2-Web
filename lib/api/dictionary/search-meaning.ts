import { getAuthToken } from "@/lib/api/utils/auth";
import type { DictionaryEntryResponse } from "@/lib/api/types/dictionary";

export async function searchDictionaryByMeaning(
  query: string
): Promise<DictionaryEntryResponse[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(
    `${apiBaseUrl}/dictionary/meaning?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "허용되지 않는 검색어입니다.");
    }
    if (response.status === 404) {
      throw new Error("검색 결과가 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "사전 조회에 실패했습니다.");
  }

  const result: { data: DictionaryEntryResponse[] } = await response.json();
  return result.data;
}
