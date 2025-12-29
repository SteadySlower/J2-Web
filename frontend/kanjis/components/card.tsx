"use client";

import type { Kanji } from "@/frontend/core/types/kanji";
import { Card } from "@/frontend/core/components/ui/card";
import { cn } from "@/lib/utils";
import CheckButton from "@/frontend/words/components/word-list/word-card/check-button";
import EditButton from "@/frontend/core/components/edit-button";
import { useParams } from "next/navigation";
import { useToggleKanjiStatus } from "@/frontend/kanjis/hooks/useToggleKanjiStatus";

type KanjiCardProps = {
  showFront: boolean;
  kanji: Kanji;
  isRevealed: boolean;
  onEdit: (kanji: Kanji) => void;
  onToggleReveal: (kanjiId: string) => void;
};

export default function KanjiCard({
  showFront,
  isRevealed,
  kanji,
  onEdit,
  onToggleReveal,
}: KanjiCardProps) {
  const params = useParams();
  const kanjibookId = params.id as string;

  const toggleMutation = useToggleKanjiStatus({
    kanjiId: kanji.id,
    bookId: kanjibookId,
  });

  const handleReveal = () => {
    onToggleReveal(kanji.id);
  };

  const handleToggleStatus = () => {
    toggleMutation.mutate(kanji.status === "learning" ? "learned" : "learning");
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleReveal}
    >
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col items-center justify-center p-6 gap-4 relative">
          <div className="relative w-fit mx-auto">
            <div
              className={cn(
                "text-6xl font-bold text-center transition-opacity inline-block",
                showFront ? "" : isRevealed && "fade-in-up"
              )}
              style={
                !showFront && isRevealed
                  ? {
                      animation: "fadeInUp 0.5s ease-out",
                    }
                  : undefined
              }
            >
              {kanji.character}
            </div>
            {showFront === false && !isRevealed && (
              <div className="absolute -inset-1 bg-gray-300 rounded-md" />
            )}
          </div>
          <div className="relative w-full">
            <div
              className={cn(
                "text-lg text-center transition-opacity",
                showFront ? isRevealed && "fade-in-up" : ""
              )}
              style={
                showFront && isRevealed
                  ? {
                      animation: "fadeInUp 0.5s ease-out",
                    }
                  : undefined
              }
            >
              <div>{kanji.meaning}</div>
              {(kanji.onReading || kanji.kunReading) && (
                <div className="mt-2 text-sm text-muted-foreground space-y-1">
                  {kanji.onReading && <div>음독: {kanji.onReading}</div>}
                  {kanji.kunReading && <div>훈독: {kanji.kunReading}</div>}
                </div>
              )}
            </div>
            {showFront === true && !isRevealed && (
              <div className="absolute inset-0 bg-gray-300 rounded-md" />
            )}
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center pb-3">
          <CheckButton
            tooptipText={
              kanji.status === "learning" ? "완료 체크" : "체크 취소"
            }
            onClick={handleToggleStatus}
            className={cn(
              kanji.status === "learned" ? "text-green-500" : "text-gray-300"
            )}
          />
          <EditButton
            className={cn(
              isRevealed ? "opacity-100" : "opacity-0 pointer-events-none",
              "hover:text-yellow-500"
            )}
            onClick={() => {
              onEdit(kanji);
            }}
          />
        </div>
      </div>
    </Card>
  );
}
