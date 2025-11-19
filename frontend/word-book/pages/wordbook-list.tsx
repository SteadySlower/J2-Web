import BookList from "@/frontend/core/components/book-list/list";
import { DateTime } from "luxon";

const mockBooks = [
  { title: "기본 단어장", createdAt: DateTime.now().minus({ days: 1 }) },
  { title: "JLPT N2 단어장", createdAt: DateTime.now().minus({ days: 7 }) },
  { title: "여행 회화", createdAt: DateTime.now().minus({ days: 30 }) },
];

export default function WordBookList() {
  return <BookList books={mockBooks} />;
}
