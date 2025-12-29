import { getAuthToken } from "@/lib/api/utils/auth";

export type KanjiDictionaryResponse = {
  meaning: string;
  ondoku: string | null;
  kundoku: string | null;
};

export async function searchDictionaryByKanji(
  character: string
): Promise<KanjiDictionaryResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(
    `${apiBaseUrl}/dictionary/kanji?character=${encodeURIComponent(character)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || "한자 문자가 1자가 아니거나, 한자가 아닌 문자입니다."
      );
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "한자 사전 조회에 실패했습니다.");
  }

  const result: { data: KanjiDictionaryResponse } = await response.json();
  return result.data;
}
