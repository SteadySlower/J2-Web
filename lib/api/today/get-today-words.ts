import { getAuthToken } from "@/lib/api/utils/auth";
import type { Word } from "@/frontend/core/types/word";
import { mapWordResponseToWord } from "@/lib/api/utils/word-mapper";
import type { WordResponse } from "@/lib/api/types/word";

/**
 * 여러 단어장에서 단어 목록을 조회합니다.
 * @param bookIds - 단어장 UUID 배열
 * @param status - 선택적 단어 상태 필터 (learning | learned)
 * @returns 단어 배열
 */
export async function getTodayWords(
  bookIds: string[],
  status?: "learning" | "learned",
): Promise<Word[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  if (bookIds.length === 0) {
    return [];
  }

  const token = await getAuthToken();

  // 여러 단어장의 데이터를 병렬로 가져오기
  const responses = await Promise.all(
    bookIds.map(async (bookId) => {
      const queryParams = new URLSearchParams();
      if (status) {
        queryParams.set("status", status);
      }
      const queryString = queryParams.toString();
      const url = `${apiBaseUrl}/word-books/${bookId}${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`단어장을 찾을 수 없습니다: ${bookId}`);
        }
        if (response.status === 403) {
          throw new Error(`이 단어장에 접근할 권한이 없습니다: ${bookId}`);
        }
        throw new Error(`단어장 상세 정보를 가져오지 못했습니다: ${bookId}`);
      }

      const result: {
        data: {
          id: string;
          title: string;
          status: "studying" | "studied";
          showFront: boolean;
          created_at: string;
          updated_at: string;
          words: WordResponse[];
        };
      } = await response.json();
      // 각 단어에 bookId 추가
      return result.data.words.map((word) => ({
        ...word,
        book_id: bookId,
      }));
    }),
  );

  // 모든 단어장의 단어를 합치기
  const allWords = responses.flat();

  // WordResponse를 Word로 변환
  return allWords.map(mapWordResponseToWord);
}
