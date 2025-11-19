"use client";

import { useState } from "react";
import BookList from "@/frontend/core/components/book-list/list";
import PlusButton from "@/frontend/core/components/book-list/plus-button";
import Modal from "@/frontend/core/components/modal/Modal";
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
      <BookList books={data ?? []} />
      <PlusButton onClick={() => setIsModalOpen(true)} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div>
          <h2>단어장 생성</h2>
          <p>모달 내용을 여기에 추가하세요</p>
        </div>
      </Modal>
    </>
  );
}
