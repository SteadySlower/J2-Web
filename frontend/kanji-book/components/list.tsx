"use client";

import { useState } from "react";
import KanjiBookCard from "./card";
import EditKanjiBookModal from "@/frontend/kanji-book/modals/edit-kanjibook";
import type { KanjiBook } from "@/lib/api/kanji-books/get-all-books";

type KanjiBookListProps = {
  kanjibooks: KanjiBook[];
};

export default function KanjiBookList({ kanjibooks }: KanjiBookListProps) {
  const [toEditKanjiBook, setToEditKanjiBook] = useState<KanjiBook | null>(
    null
  );

  const handleEdit = (kanjibook: KanjiBook) => {
    setToEditKanjiBook(kanjibook);
  };

  const handleCloseModal = () => {
    setToEditKanjiBook(null);
  };

  if (kanjibooks.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 px-10">
        <p className="text-muted-foreground text-lg">
          첫번째 한자장을 추가해주세요
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-4 px-16">
        {kanjibooks.map((kanjibook) => (
          <KanjiBookCard
            key={kanjibook.id}
            kanjibook={kanjibook}
            onEdit={handleEdit}
          />
        ))}
      </div>
      {toEditKanjiBook && (
        <EditKanjiBookModal
          isOpen={toEditKanjiBook !== null}
          onClose={handleCloseModal}
          kanjibook={toEditKanjiBook}
        />
      )}
    </>
  );
}

