import type { KanjiResponse } from "./kanji";

/**
 * 서버 API에서 반환하는 단어 응답 타입
 * kanjis는 선택적으로 포함될 수 있습니다.
 */
export type WordResponse = {
  id: string;
  book_id?: string; // 일부 API에서는 포함되지 않을 수 있음
  japanese: string;
  meaning: string;
  pronunciation: string;
  status: "learning" | "learned";
  created_at: string;
  updated_at: string;
  kanjis?: KanjiResponse[]; // 일부 API에서는 포함되지 않을 수 있음
};
