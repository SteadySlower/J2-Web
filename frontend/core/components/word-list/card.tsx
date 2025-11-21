"use client";

import { useState } from "react";
import type { Word } from "@/lib/types/word";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/frontend/core/components/ui/card";

export default function WordCard(word: Word) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{word.japanese}</p>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <p className="text-sm text-muted-foreground text-center mb-2">
            {word.pronunciation}
          </p>
          <p className="text-base text-center mb-4">{word.meaning}</p>
          {word.kanjis.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {word.kanjis.map((kanji) => (
                <span
                  key={kanji.id}
                  className="text-xl font-semibold border rounded px-2 py-1"
                >
                  {kanji.character}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
