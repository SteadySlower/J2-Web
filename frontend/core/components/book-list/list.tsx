import { DateTime } from "luxon";
import BookCard from "./card";

type Book = {
  id: string;
  title: string;
  createdAt: DateTime;
  href: string;
};

type BookListProps = {
  books: Book[];
  bookTypeLabel: string;
};

export default function BookList({ books, bookTypeLabel }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 px-10">
        <p className="text-muted-foreground text-lg">
          첫번째 {bookTypeLabel}를 추가해주세요
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto flex flex-col gap-4 p-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          createdAt={book.createdAt}
          href={book.href}
        />
      ))}
    </div>
  );
}
