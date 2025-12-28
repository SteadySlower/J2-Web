import { DateTime } from "luxon";
import { getAuthToken } from "@/lib/api/utils/auth";
import type { KanjiResponse } from "@/lib/api/types/kanji";
import { mapKanjiResponseToKanji } from "@/lib/api/utils/word-mapper";
import type { Kanji } from "@/frontend/core/types/kanji";

type KanjiInBookResponse = {
  id: string;
  character: string;
  meaning: string;
  on_reading: string | null;
  kun_reading: string | null;
  status: "learning" | "learned";
  created_at: string;
  updated_at: string;
};

type KanjiBookDetailResponse = {
  id: string;
  title: string;
  status: "studying" | "studied";
  showFront: boolean;
  created_at: string;
  updated_at: string;
  kanjis: KanjiInBookResponse[];
};

export type KanjiBookDetail = {
  id: string;
  title: string;
  status: "studying" | "studied";
  showFront: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
  kanjis: Kanji[];
};

export async function getKanjiBookDetail(id: string): Promise<KanjiBookDetail> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/kanji-books/${id}`, {
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
    throw new Error("한자장 상세 정보를 가져오지 못했습니다.");
  }

  const result: { data: KanjiBookDetailResponse } = await response.json();

  return {
    id: result.data.id,
    title: result.data.title,
    status: result.data.status,
    showFront: result.data.showFront,
    createdAt: DateTime.fromISO(result.data.created_at),
    updatedAt: DateTime.fromISO(result.data.updated_at),
    kanjis: result.data.kanjis.map((kanji) =>
      mapKanjiResponseToKanji({
        id: kanji.id,
        character: kanji.character,
        meaning: kanji.meaning,
        on_reading: kanji.on_reading,
        kun_reading: kanji.kun_reading,
        status: kanji.status,
      })
    ),
  };
}
