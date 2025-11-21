import { DateTime } from "luxon";
import type { Word } from "./word";

export type WordBookListItem = {
  id: string;
  title: string;
  createdAt: DateTime;
  href: string;
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
