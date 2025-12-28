import { DateTime } from "luxon";
import { getAuthToken } from "@/lib/api/utils/auth";

export type KanjiBook = {
  id: string;
  title: string;
  status: "studying" | "studied";
  showFront: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
};

type KanjiBookResponse = {
  id: string;
  title: string;
  status: string;
  showFront: boolean;
  createdAt: string;
  updatedAt: string;
}[];

export async function fetchKanjiBooks(): Promise<KanjiBook[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/kanji-books`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("한자장 목록을 가져오지 못했습니다.");
  }

  const result: { data: KanjiBookResponse } = await response.json();

  return result.data.map((book) => ({
    id: book.id,
    title: book.title,
    status: book.status as "studying" | "studied",
    showFront: book.showFront,
    createdAt: DateTime.fromISO(book.createdAt),
    updatedAt: DateTime.fromISO(book.updatedAt),
  }));
}
