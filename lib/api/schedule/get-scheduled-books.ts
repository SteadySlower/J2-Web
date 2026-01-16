import { DateTime } from "luxon";
import { getAuthToken } from "@/lib/api/utils/auth";
import type {
  ScheduleBooks,
  ScheduleBook,
} from "@/frontend/core/types/schedule";

type ScheduledWordBookResponse = {
  study: {
    id: string;
    title: string;
    status: string;
    show_front: boolean;
    created_at: string;
    updated_at: string;
  }[];
  review: {
    id: string;
    title: string;
    status: string;
    show_front: boolean;
    created_at: string;
    updated_at: string;
  }[];
};

type ScheduledKanjiBookResponse = {
  study: {
    id: string;
    title: string;
    status: string;
    show_front: boolean;
    created_at: string;
    updated_at: string;
  }[];
  review: {
    id: string;
    title: string;
    status: string;
    show_front: boolean;
    created_at: string;
    updated_at: string;
  }[];
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
  // 클라이언트의 로컬 타임존 기준 현재 날짜를 YYYY-MM-DD 형식으로 가져옵니다
  // 이 함수는 클라이언트 컴포넌트에서만 호출되므로 브라우저의 로컬 타임존을 사용합니다
  const currentDate = DateTime.now().toISODate();
  if (!currentDate) {
    throw new Error("현재 날짜를 가져올 수 없습니다.");
  }

  const [wordBooksResponse, kanjiBooksResponse] = await Promise.all([
    fetch(`${apiBaseUrl}/schedules/word-books?current_date=${currentDate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    fetch(`${apiBaseUrl}/schedules/kanji-books?current_date=${currentDate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  ]);

  if (!wordBooksResponse.ok) {
    throw new Error("스케줄에 맞는 단어장 목록을 가져오지 못했습니다.");
  }

  if (!kanjiBooksResponse.ok) {
    throw new Error("스케줄에 맞는 한자장 목록을 가져오지 못했습니다.");
  }

  const wordBooksResult: { data: ScheduledWordBookResponse } =
    await wordBooksResponse.json();
  const kanjiBooksResult: { data: ScheduledKanjiBookResponse } =
    await kanjiBooksResponse.json();

  const study: ScheduleBook[] = [
    ...wordBooksResult.data.study.map((book) =>
      parseToScheduleBook(book, "word")
    ),
    ...kanjiBooksResult.data.study.map((book) =>
      parseToScheduleBook(book, "kanji")
    ),
  ];

  const review: ScheduleBook[] = [
    ...wordBooksResult.data.review.map((book) =>
      parseToScheduleBook(book, "word")
    ),
    ...kanjiBooksResult.data.review.map((book) =>
      parseToScheduleBook(book, "kanji")
    ),
  ];

  study.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  review.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  return {
    study,
    review,
  };
}
