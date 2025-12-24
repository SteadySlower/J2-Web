"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
import KanjiList from "@/frontend/words/components/kanji-list";
import type { Word } from "@/frontend/core/types/word";

type KanjisModalProps = {
  isOpen: boolean;
  onClose: () => void;
  word: Word;
};

export default function KanjisModal({
  isOpen,
  onClose,
  word,
}: KanjisModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{word.japanese}에 사용된 한자</DialogTitle>
        </DialogHeader>
        <KanjiList kanjis={word.kanjis} />
      </DialogContent>
    </Dialog>
  );
}
