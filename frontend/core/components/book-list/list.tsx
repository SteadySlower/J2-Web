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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          color: "#666",
        }}
      >
        {`첫번째 ${bookTypeLabel}를 추가해주세요`}
      </div>
    );
  }

  return (
    <div>
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
