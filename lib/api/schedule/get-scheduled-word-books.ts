import { DateTime } from "luxon";
import { getAuthToken } from "@/lib/api/utils/auth";
import type { ScheduledWordBooks } from "@/frontend/core/types/schedule";

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

export async function getScheduledWordBooks(): Promise<ScheduledWordBooks> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${apiBaseUrl}/schedules/word-books`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("스케줄에 맞는 단어장 목록을 가져오지 못했습니다.");
  }

  const result: { data: ScheduledWordBookResponse } = await response.json();

  return {
    study: result.data.study.map((book) => ({
      id: book.id,
      title: book.title,
      status: book.status as "studying" | "studied",
      showFront: book.show_front,
      createdAt: DateTime.fromISO(book.created_at),
      updatedAt: DateTime.fromISO(book.updated_at),
    })),
    review: result.data.review.map((book) => ({
      id: book.id,
      title: book.title,
      status: book.status as "studying" | "studied",
      showFront: book.show_front,
      createdAt: DateTime.fromISO(book.created_at),
      updatedAt: DateTime.fromISO(book.updated_at),
    })),
  };
}
