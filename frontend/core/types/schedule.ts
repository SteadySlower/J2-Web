import { DateTime } from "luxon";
import type { WordBook } from "./word-books";
import type { KanjiBook } from "./kanji-book";

export type Schedule = {
  id: string;
  studyDays: number;
  reviewDays: number[];
  createdAt: DateTime;
  updatedAt: DateTime;
};

export type ScheduledWordBooks = {
  study: WordBook[];
  review: WordBook[];
};

export type ScheduledKanjiBooks = {
  study: KanjiBook[];
  review: KanjiBook[];
};

export type ScheduleBook = {
  id: string;
  title: string;
  type: "word" | "kanji";
  status: "studying" | "studied";
  showFront: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
};

export type ScheduleBooks = {
  study: ScheduleBook[];
  review: ScheduleBook[];
  statistics: {
    total: number;
    learning: number;
    learned: number;
    review_date: string;
  };
};
