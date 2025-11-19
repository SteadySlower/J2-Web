import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/client";

type WordBookResponse = {
  id: string;
  title: string;
  createdAt: string;
}[];

export type WordBookListItem = {
  id: string;
  title: string;
  createdAt: DateTime;
  href: string;
};

export async function fetchWordBooks(): Promise<WordBookListItem[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${apiBaseUrl}/word-books`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("단어장 목록을 가져오지 못했습니다.");
  }

  const result: { data: WordBookResponse } = await response.json();

  return result.data.map((book) => ({
    id: book.id,
    title: book.title,
    createdAt: DateTime.fromISO(book.createdAt),
    href: `/word-books/${book.id}`,
  }));
}
