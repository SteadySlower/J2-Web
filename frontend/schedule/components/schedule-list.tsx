"use client";

import { useQuery } from "@tanstack/react-query";
import BookList from "@/frontend/core/components/books/list";
import { getScheduledBooks } from "@/lib/api/schedule/get-scheduled-books";
import type { ScheduleBook } from "@/frontend/core/types/schedule";

export default function ScheduleList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["scheduled-books"],
    queryFn: getScheduledBooks,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return (
      <div>스케줄 목록을 불러오지 못했습니다. {(error as Error).message}</div>
    );
  }

  const getHref = (book: ScheduleBook) => {
    return book.type === "word"
      ? `/word-books/${book.id}`
      : `/kanji-books/${book.id}`;
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-4xl font-semibold mb-4 px-16">학습</h2>
        <BookList<ScheduleBook>
          books={data?.study ?? []}
          emptyMessage="학습할 단어장이나 한자장이 없습니다"
          href={getHref}
          editModal={() => null}
        />
      </div>
      <div>
        <h2 className="text-4xl font-semibold mb-4 px-16">복습</h2>
        <BookList<ScheduleBook>
          books={data?.review ?? []}
          emptyMessage="복습할 단어장이나 한자장이 없습니다"
          href={getHref}
          editModal={() => null}
        />
      </div>
    </div>
  );
}
