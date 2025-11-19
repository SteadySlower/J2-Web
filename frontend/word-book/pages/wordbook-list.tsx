"use client";

import BookList from "@/frontend/core/components/book-list/list";
import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

type WordBookApiItem = {
  id: string;
  title: string;
  createdAt: string;
};

type WordBookBookListItem = {
  id: string;
  title: string;
  createdAt: DateTime;
  href: string;
};

async function fetchWordBooks(): Promise<WordBookBookListItem[]> {
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

  const result: { data: WordBookApiItem[] } = await response.json();

  return result.data.map((book) => ({
    id: book.id,
    title: book.title,
    createdAt: DateTime.fromISO(book.createdAt),
    href: `/word-books/${book.id}`,
  }));
}

export default function WordBookList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["word-books"],
    queryFn: fetchWordBooks,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return (
      <div>단어장 목록을 불러오지 못했습니다. {(error as Error).message}</div>
    );
  }

  return <BookList books={data ?? []} />;
}
