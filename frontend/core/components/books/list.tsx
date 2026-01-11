"use client";

import { useState, type ReactNode } from "react";
import BookCard from "./card";
import type { Book } from "./types";

type BookListProps<T extends Book> = {
  books: T[];
  emptyMessage: string;
  href: (book: T) => string;
  editModal: (
    book: T | null,
    isOpen: boolean,
    onClose: () => void
  ) => ReactNode;
};

export default function BookList<T extends Book>({
  books,
  emptyMessage,
  href,
  editModal,
}: BookListProps<T>) {
  const [toEditBook, setToEditBook] = useState<T | null>(null);

  const handleEdit = (book: T) => {
    setToEditBook(book);
  };

  const handleCloseModal = () => {
    setToEditBook(null);
  };

  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 px-10">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-4 px-16">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onEdit={handleEdit} href={href} />
        ))}
      </div>
      {editModal(toEditBook, toEditBook !== null, handleCloseModal)}
    </>
  );
}
