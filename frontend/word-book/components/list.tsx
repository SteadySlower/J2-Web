"use client";

import BookList from "@/frontend/core/components/books/list";
import EditWordBookModal from "@/frontend/word-book/modals/edit-wordbook";
import type { WordBook } from "@/frontend/core/types/word-books";

type WordBookListProps = {
  wordbooks: WordBook[];
};

export default function WordBookList({ wordbooks }: WordBookListProps) {
  return (
    <BookList
      books={wordbooks}
      emptyMessage="첫번째 단어장을 추가해주세요"
      href={(book) => `/word-books/${book.id}`}
      editModal={(book, isOpen, onClose) =>
        book ? (
          <EditWordBookModal
            isOpen={isOpen}
            onClose={onClose}
            wordbook={book}
          />
        ) : null
      }
    />
  );
}
