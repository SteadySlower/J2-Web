"use client";

import BookList from "@/frontend/core/components/books/list";
import EditKanjiBookModal from "@/frontend/kanji-book/modals/edit-kanjibook";
import type { KanjiBook } from "@/frontend/core/types/kanji-book";

type KanjiBookListProps = {
  kanjibooks: KanjiBook[];
};

export default function KanjiBookList({ kanjibooks }: KanjiBookListProps) {
  return (
    <BookList
      books={kanjibooks}
      emptyMessage="첫번째 한자장을 추가해주세요"
      href={(book) => `/kanji-books/${book.id}`}
      editModal={(book, isOpen, onClose) =>
        book ? (
          <EditKanjiBookModal
            isOpen={isOpen}
            onClose={onClose}
            kanjibook={book}
          />
        ) : null
      }
    />
  );
}
