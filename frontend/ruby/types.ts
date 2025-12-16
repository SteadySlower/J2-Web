export type RubySegment =
  | { type: "okurigana"; base: string; rt: string }
  | { type: "text"; text: string };
