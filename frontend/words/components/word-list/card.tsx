"use client";

import { useState } from "react";
import type { Word } from "@/lib/types/word";
import type { Kanji } from "@/lib/types/kanji";
import { Card } from "@/frontend/core/components/ui/card";

const getTextSize = (text: string) => {
  const length = text.length;
  if (length <= 8) return "text-4xl";
  if (length <= 14) return "text-3xl";
  if (length <= 20) return "text-2xl";
  return "text-xl";
};

type JapaneseTextProps = {
  text: string;
};

function JapaneseText({ text }: JapaneseTextProps) {
  return (
    <div className="flex-1 p-6 flex items-center justify-center">
      <p className={`${getTextSize(text)} font-semibold`}>{text}</p>
    </div>
  );
}

type MeaningTextProps = {
  text: string;
  isRevealed: boolean;
  onReveal: () => void;
};

function MeaningText({ text, isRevealed, onReveal }: MeaningTextProps) {
  return (
    <div className="flex-1 p-6">
      <p className={`${getTextSize(text)} text-black`}>
        <span className="relative inline-block" onClick={onReveal}>
          <span className="relative z-10">{text}</span>
          <span
            className={`absolute inset-0 bg-black transition-all duration-300 ease-in-out ${
              isRevealed
                ? "clip-path-[inset(0_0_0_100%)]"
                : "clip-path-[inset(0_0_0_0%)]"
            }`}
            style={{
              clipPath: isRevealed ? "inset(0 0 0 100%)" : "inset(0 0 0 0%)",
            }}
          />
        </span>
      </p>
    </div>
  );
}

type KanjiButtonProps = {
  variant: "black" | "white";
  onClick: (e: React.MouseEvent) => void;
};

function KanjiButton({ variant, onClick }: KanjiButtonProps) {
  const className =
    variant === "black"
      ? "absolute bottom-1 right-1 w-6 h-6 bg-black text-white flex items-center justify-center text-sm rounded-full z-10"
      : "absolute bottom-1 right-1 w-6 h-6 bg-white text-black border border-black flex items-center justify-center text-sm rounded-full z-10";

  return (
    <button className={className} onClick={onClick}>
      漢
    </button>
  );
}

type KanjiItemProps = {
  kanji: Kanji;
};

function KanjiItem({ kanji }: KanjiItemProps) {
  return (
    <span className="text-4xl font-semibold border rounded px-2 py-1 flex flex-col items-center gap-2">
      {kanji.character}
      <span className="text-base text-muted-foreground mt-1">
        {kanji.meaning}
      </span>
    </span>
  );
}

type KanjiListProps = {
  kanjis: Kanji[];
  isExpanded: boolean;
  onToggle: (e: React.MouseEvent) => void;
};

function KanjiList({ kanjis, isExpanded, onToggle }: KanjiListProps) {
  return (
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden relative">
        {isExpanded && <KanjiButton variant="white" onClick={onToggle} />}
        <div className="p-6 px-12">
          <div className="flex flex-wrap justify-center gap-2">
            {kanjis.map((kanji) => (
              <KanjiItem key={kanji.id} kanji={kanji} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WordCard(word: Word) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isKanjisExpanded, setIsKanjisExpanded] = useState(false);

  const handleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  const handleKanjisClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsKanjisExpanded(!isKanjisExpanded);
    if (isKanjisExpanded) {
      setIsRevealed(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer relative flex flex-col">
      <div className="flex relative">
        <JapaneseText text={word.japanese} />
        <MeaningText
          text={word.meaning}
          isRevealed={isRevealed}
          onReveal={handleReveal}
        />
        {word.kanjis.length > 0 && isRevealed && !isKanjisExpanded && (
          <KanjiButton variant="black" onClick={handleKanjisClick} />
        )}
      </div>
      {word.kanjis.length > 0 && (
        <KanjiList
          kanjis={word.kanjis}
          isExpanded={isKanjisExpanded}
          onToggle={handleKanjisClick}
        />
      )}
    </Card>
  );
}
