export type KanjiResponse = {
  id: string;
  book_id: string;
  character: string;
  meaning: string;
  on_reading: string | null;
  kun_reading: string | null;
  status: "learning" | "learned";
};
