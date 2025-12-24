"use client";

import { useState } from "react";
import WordBookCard from "./card";
import EditWordBookModal from "@/frontend/word-book/modals/edit-wordbook";
import type { WordBook } from "@/frontend/core/types/word-books";

type WordBookListProps = {
  wordbooks: WordBook[];
};

export default function WordBookList({ wordbooks }: WordBookListProps) {
  const [toEditWordbook, setToEditWordbook] = useState<WordBook | null>(null);

  const handleEdit = (wordbook: WordBook) => {
    setToEditWordbook(wordbook);
  };

  const handleCloseModal = () => {
    setToEditWordbook(null);
  };

  if (wordbooks.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 px-10">
        <p className="text-muted-foreground text-lg">
          첫번째 단어장을 추가해주세요
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-4 px-16">
        {wordbooks.map((wordbook) => (
          <WordBookCard
            key={wordbook.id}
            wordbook={wordbook}
            onEdit={handleEdit}
          />
        ))}
      </div>
      {toEditWordbook && (
        <EditWordBookModal
          isOpen={toEditWordbook !== null}
          onClose={handleCloseModal}
          wordbook={toEditWordbook}
        />
      )}
    </>
  );
}
