import { DateTime } from "luxon";
import type { Kanji } from "./kanji";

export type Word = {
  id: string;
  japanese: string;
  meaning: string;
  pronunciation: string;
  status: "learning" | "learned";
  createdAt: DateTime;
  updatedAt: DateTime;
  kanjis: Kanji[];
};
