export type Kanji = {
  id: string;
  character: string;
  meaning: string;
  onReading: string | null;
  kunReading: string | null;
  status: "learning" | "learned";
};
