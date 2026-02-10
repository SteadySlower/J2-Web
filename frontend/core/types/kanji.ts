export type Kanji = {
  id: string;
  bookId: string;
  character: string;
  meaning: string;
  onReading: string | null;
  kunReading: string | null;
  status: "learning" | "learned";
};
