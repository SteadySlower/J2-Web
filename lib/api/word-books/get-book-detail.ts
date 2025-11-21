import { DateTime } from "luxon";
import { getAuthToken } from "@/lib/api/utils/auth";

type KanjiResponse = {
  id: string;
  character: string;
  meaning: string;
  on_reading: string | null;
  kun_reading: string | null;
  status: "learning" | "learned";
};

type WordResponse = {
  id: string;
  japanese: string;
  meaning: string;
  pronunciation: string;
  status: "learning" | "learned";
  created_at: string;
  updated_at: string;
  kanjis: KanjiResponse[];
};

type WordBookDetailResponse = {
  id: string;
  title: string;
  status: "studying" | "studied";
  showFront: boolean;
  created_at: string;
  updated_at: string;
  words: WordResponse[];
};

export type Kanji = {
  id: string;
  character: string;
  meaning: string;
  onReading: string | null;
  kunReading: string | null;
  status: "learning" | "learned";
};

export type Word = {
  id: string;
  japanese: string;
  meaning: string;
  pronunciation: string;
  status: "learning" | "learned";
  createdAt: DateTime;
  updatedAt: DateTime;
  kanjis: Kanji[];
};

export type WordBookDetail = {
  id: string;
  title: string;
  status: "studying" | "studied";
  showFront: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
  words: Word[];
};

export async function getBookDetail(id: string): Promise<WordBookDetail> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/word-books/${id}`, {
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
    throw new Error("단어장 상세 정보를 가져오지 못했습니다.");
  }

  const result: { data: WordBookDetailResponse } = await response.json();

  return {
    id: result.data.id,
    title: result.data.title,
    status: result.data.status,
    showFront: result.data.showFront,
    createdAt: DateTime.fromISO(result.data.created_at),
    updatedAt: DateTime.fromISO(result.data.updated_at),
    words: result.data.words.map((word) => ({
      id: word.id,
      japanese: word.japanese,
      meaning: word.meaning,
      pronunciation: word.pronunciation,
      status: word.status,
      createdAt: DateTime.fromISO(word.created_at),
      updatedAt: DateTime.fromISO(word.updated_at),
      kanjis: word.kanjis.map((kanji) => ({
        id: kanji.id,
        character: kanji.character,
        meaning: kanji.meaning,
        onReading: kanji.on_reading,
        kunReading: kanji.kun_reading,
        status: kanji.status,
      })),
    })),
  };
}
