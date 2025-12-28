import { DateTime } from "luxon";

export type Book = {
  id: string;
  title: string;
  status: "studying" | "studied";
  showFront: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
};
