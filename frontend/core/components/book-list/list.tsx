import { DateTime } from "luxon";
import BookCard from "./card";

type Book = {
  title: string;
  createdAt: DateTime;
};

type BookListProps = {
  books: Book[];
};

export default function BookList({ books }: BookListProps) {
  return (
    <div>
      {books.map((book, index) => (
        <BookCard key={index} title={book.title} createdAt={book.createdAt} />
      ))}
    </div>
  );
}
