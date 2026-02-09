import { getAuthToken } from "@/lib/api/utils/auth";
import type { Word } from "@/frontend/core/types/word";
import { mapWordResponseToWord } from "@/lib/api/utils/word-mapper";
import type { WordResponse } from "@/lib/api/types/word";

export type GetKanjiWordsResponse = Word[];

export async function getKanjiWords(
  kanjiId: string
): Promise<GetKanjiWordsResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/kanjis/${kanjiId}/words`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("한자를 찾을 수 없습니다");
    }
    if (response.status === 403) {
      throw new Error("이 한자에 접근할 권한이 없습니다");
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || "한자와 연결된 단어 목록 조회에 실패했습니다."
    );
  }

  const result: { data: WordResponse[] } = await response.json();
  return result.data.map((word) =>
    mapWordResponseToWord({
      ...word,
      kanjis: [],
    })
  );
}
