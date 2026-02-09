"use client";

import { useQuery } from "@tanstack/react-query";
import BookList from "@/frontend/core/components/books/list";
import { getScheduledBooks } from "@/lib/api/schedule/get-scheduled-books";
import type { ScheduleBook } from "@/frontend/core/types/schedule";
import StatisticsBoard from "./statistics-board";

type ScheduleListProps = {
  onSettingClick: () => void;
  onResetClick: () => void;
};

export default function ScheduleList({
  onSettingClick,
  onResetClick,
}: ScheduleListProps) {
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

  if (!data) {
    return <div>스케줄 목록을 불러오지 못했습니다.</div>;
  }

  const getStudyHref = (book: ScheduleBook) => {
    return book.type === "word"
      ? `/word-books/${book.id}`
      : `/kanji-books/${book.id}`;
  };

  const getReviewHref = (book: ScheduleBook) => {
    const baseUrl =
      book.type === "word"
        ? `/word-books/${book.id}`
        : `/kanji-books/${book.id}`;
    return `${baseUrl}?mode=review`;
  };

  // 학습할 단어장 ID 추출 (type이 "word"인 것만)
  const studyWordBookIds = data.study
    .filter((book) => book.type === "word")
    .map((book) => book.id);

  return (
    <div className="flex flex-col gap-2">
      <StatisticsBoard
        total={data.statistics.total}
        learning={data.statistics.learning}
        learned={data.statistics.learned}
        reviewDate={data.statistics.review_date}
        studyWordBookIds={studyWordBookIds}
        onSettingClick={onSettingClick}
        onResetClick={onResetClick}
      />
      <div className="grid grid-cols-2">
        <div>
          <h2 className="text-4xl font-semibold mb-4 px-16">학습</h2>
          <BookList<ScheduleBook>
            books={data?.study ?? []}
            emptyMessage="학습할 단어장이나 한자장이 없습니다"
            href={getStudyHref}
            editModal={() => null}
          />
        </div>
        <div>
          <h2 className="text-4xl font-semibold mb-4 px-16">복습</h2>
          <BookList<ScheduleBook>
            books={data?.review ?? []}
            emptyMessage="복습할 단어장이나 한자장이 없습니다"
            href={getReviewHref}
            editModal={() => null}
          />
        </div>
      </div>
    </div>
  );
}
