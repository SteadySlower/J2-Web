"use client";

import BookList from "@/frontend/core/components/book-list/list";
import PlusButton from "@/frontend/core/components/book-list/plus-button";
import { useQuery } from "@tanstack/react-query";
import { fetchWordBooks } from "@/lib/api/word-books/get-all-books";

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

  return (
    <>
      <BookList books={data ?? []} />
      <PlusButton onClick={() => {}} />
    </>
  );
}
