import { getAuthToken } from "@/lib/api/utils/auth";
import type { Kanji } from "@/frontend/core/types/kanji";
import { mapKanjiResponseToKanji } from "@/lib/api/utils/word-mapper";
import type { KanjiResponse } from "@/lib/api/types/kanji";

/**
 * 여러 한자장에서 한자 목록을 조회합니다.
 * @param bookIds - 한자장 UUID 배열
 * @param status - 선택적 한자 상태 필터 (learning | learned)
 * @returns 한자 배열
 */
export async function getTodayKanjis(
  bookIds: string[],
  status?: "learning" | "learned",
): Promise<Kanji[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  if (bookIds.length === 0) {
    return [];
  }

  const token = await getAuthToken();

  // 여러 한자장의 데이터를 병렬로 가져오기
  const responses = await Promise.all(
    bookIds.map(async (bookId) => {
      const queryParams = new URLSearchParams();
      if (status) {
        queryParams.set("status", status);
      }
      const queryString = queryParams.toString();
      const url = `${apiBaseUrl}/kanji-books/${bookId}${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`한자장을 찾을 수 없습니다: ${bookId}`);
        }
        if (response.status === 403) {
          throw new Error(`이 한자장에 접근할 권한이 없습니다: ${bookId}`);
        }
        throw new Error(`한자장 상세 정보를 가져오지 못했습니다: ${bookId}`);
      }

      const result: {
        data: {
          id: string;
          title: string;
          status: "studying" | "studied";
          showFront: boolean;
          created_at: string;
          updated_at: string;
          kanjis: KanjiResponse[];
        };
      } = await response.json();
      return result.data.kanjis;
    }),
  );

  // 모든 한자장의 한자를 합치기
  const allKanjis = responses.flat();

  // kanji.id를 기준으로 중복 제거 (같은 한자가 여러 한자장에 속할 수 있음)
  // 첫 번째로 발견된 한자의 book_id를 사용
  const uniqueKanjisMap = new Map<string, KanjiResponse>();
  for (const kanji of allKanjis) {
    if (!uniqueKanjisMap.has(kanji.id)) {
      uniqueKanjisMap.set(kanji.id, kanji);
    }
  }
  const uniqueKanjis = Array.from(uniqueKanjisMap.values());

  // KanjiResponse를 Kanji로 변환
  return uniqueKanjis.map(mapKanjiResponseToKanji);
}
