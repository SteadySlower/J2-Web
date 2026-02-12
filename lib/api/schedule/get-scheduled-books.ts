import { DateTime } from "luxon";
import { getAuthToken } from "@/lib/api/utils/auth";
import { getCurrentLocalDate } from "@/lib/api/utils/date";
import type {
  ScheduleBooks,
  ScheduleBook,
} from "@/frontend/core/types/schedule";

type BookResponse = {
  id: string;
  title: string;
  status: string;
  show_front: boolean;
  created_at: string;
  updated_at: string;
};

type StudyStatistics = {
  total: number;
  learning: number;
  review_date: string;
};

type ScheduledBooksResponse = {
  word_books: {
    study: BookResponse[];
    review: BookResponse[];
    study_statistics: StudyStatistics;
  };
  kanji_books: {
    study: BookResponse[];
    review: BookResponse[];
    study_statistics: StudyStatistics;
  };
};

function parseToScheduleBook(
  book: {
    id: string;
    title: string;
    status: string;
    show_front: boolean;
    created_at: string;
    updated_at: string;
  },
  type: "word" | "kanji"
): ScheduleBook {
  return {
    id: book.id,
    title: book.title,
    type,
    status: book.status as "studying" | "studied",
    showFront: book.show_front,
    createdAt: DateTime.fromISO(book.created_at),
    updatedAt: DateTime.fromISO(book.updated_at),
  };
}

export async function getScheduledBooks(): Promise<ScheduleBooks> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();
  const currentDate = getCurrentLocalDate();

  const response = await fetch(
    `${apiBaseUrl}/schedules/books?current_date=${currentDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "스케줄에 맞는 단어장 및 한자장 목록을 가져오지 못했습니다."
    );
  }

  const result: { data: ScheduledBooksResponse } = await response.json();
  const { word_books, kanji_books } = result.data;

  const study: ScheduleBook[] = [
    ...word_books.study.map((book) => parseToScheduleBook(book, "word")),
    ...kanji_books.study.map((book) => parseToScheduleBook(book, "kanji")),
  ];

  const review: ScheduleBook[] = [
    ...word_books.review.map((book) => parseToScheduleBook(book, "word")),
    ...kanji_books.review.map((book) => parseToScheduleBook(book, "kanji")),
  ];

  study.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  review.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  const wordTotal = word_books.study_statistics.total;
  const wordLearning = word_books.study_statistics.learning;

  const kanjiTotal = kanji_books.study_statistics.total;
  const kanjiLearning = kanji_books.study_statistics.learning;

  return {
    study,
    review,
    statistics: {
      review_date: word_books.study_statistics.review_date,
      word_total: wordTotal,
      word_learning: wordLearning,
      kanji_total: kanjiTotal,
      kanji_learning: kanjiLearning,
    },
  };
}
