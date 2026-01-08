"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
import WordList from "@/frontend/kanjis/components/word-list";
import type { Kanji } from "@/frontend/core/types/kanji";
import { useGetKanjiWords } from "@/frontend/kanjis/hooks/useGetKanjiWords";

type WordsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  kanji: Kanji;
};

export default function WordsModal({
  isOpen,
  onClose,
  kanji,
}: WordsModalProps) {
  const { data: words, isLoading, error } = useGetKanjiWords(
    kanji.id,
    isOpen
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{kanji.character}에 사용된 단어</DialogTitle>
        </DialogHeader>
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <p className="text-muted-foreground text-sm">로딩 중...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-10">
            <p className="text-destructive text-sm">
              {(error as Error).message || "단어 목록을 불러오는데 실패했습니다."}
            </p>
          </div>
        )}
        {!isLoading && !error && words && <WordList words={words} />}
      </DialogContent>
    </Dialog>
  );
}

