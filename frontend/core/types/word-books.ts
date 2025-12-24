import { DateTime } from "luxon";
import type { Word } from "./word";

export type WordBook = {
  id: string;
  title: string;
  status: "studying" | "studied";
  showFront: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
};

export type WordBookDetail = {
  id: string;
  title: string;
  status: "studying" | "studied";
  showFront: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
  words: Word[];
};
