"use client";

import type { Word } from "@/lib/types/word";
import { Card } from "@/frontend/core/components/ui/card";
import LeftText from "./word-card/left-text";
import CheckButton from "./word-card/check-button";
import RightText from "./word-card/right-text";
import EditButton from "../../../core/components/edit-button";
import KanjiButton from "./word-card/kanji-button";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useToggleWordStatus } from "@/frontend/words/hooks/useToggleWordStatus";

type WordCardProps = {
  showFront: boolean;
  word: Word;
  isRevealed: boolean;
  onToggleReveal: (wordId: string) => void;
  onEdit: (word: Word) => void;
  onShowKanjis: (word: Word) => void;
};

export default function WordCard({
  showFront,
  isRevealed,
  onToggleReveal,
  word,
  onEdit,
  onShowKanjis,
}: WordCardProps) {
  const params = useParams();
  const wordbookId = params.id as string;

  const toggleMutation = useToggleWordStatus({
    wordId: word.id,
    bookId: wordbookId,
  });

  const handleReveal = () => {
    onToggleReveal(word.id);
  };

  const handleToggleStatus = () => {
    toggleMutation.mutate(word.status === "learning" ? "learned" : "learning");
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <div className="flex pr-6 items-stretch">
        <LeftText text={showFront ? word.japanese : word.meaning} />
        <RightText
          text={showFront ? word.meaning : word.japanese}
          isRevealed={isRevealed}
          onReveal={handleReveal}
        />
        <div className="flex flex-col gap-2 py-6 px-2 justify-center">
          <CheckButton
            tooptipText={word.status === "learning" ? "완료 체크" : "체크 취소"}
            onClick={handleToggleStatus}
            className={cn(
              word.status === "learned" ? "text-green-500" : "text-gray-300"
            )}
          />
          <EditButton
            className={cn(
              isRevealed ? "opacity-100" : "opacity-0 pointer-events-none",
              "hover:text-yellow-500"
            )}
            onClick={() => onEdit(word)}
          />
          <KanjiButton
            showButton={isRevealed && word.kanjis.length > 0}
            onClick={() => onShowKanjis(word)}
          />
        </div>
      </div>
    </Card>
  );
}
