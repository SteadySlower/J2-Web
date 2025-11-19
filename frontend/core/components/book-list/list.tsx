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
};

export default function BookList({ books }: BookListProps) {
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
