"use client";

import { useState } from "react";
import BookList from "@/frontend/core/components/book-list/list";
import PlusButton from "@/frontend/core/components/plus-button";
import CreateWordBookModal from "@/frontend/word-book/modals/create-wordbook";
import { useQuery } from "@tanstack/react-query";
import { fetchWordBooks } from "@/lib/api/word-books/get-all-books";

export default function WordBookList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["word-books"],
    queryFn: fetchWordBooks,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return (
      <div>단어장 목록을 불러오지 못했습니다. {(error as Error).message}</div>
    );
  }

  return (
    <>
      <BookList books={data ?? []} bookTypeLabel="단어장" />
      <div className="fixed bottom-6 right-6 z-50">
        <PlusButton onClick={() => setIsModalOpen(true)} />
      </div>
      <CreateWordBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
