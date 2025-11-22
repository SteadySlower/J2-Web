"use client";

import { useState } from "react";
import WordBookList from "@/frontend/word-book/components/list";
import PlusButton from "@/frontend/core/components/plus-button";
import CreateWordBookModal from "@/frontend/word-book/modals/create-wordbook";
import { useQuery } from "@tanstack/react-query";
import { fetchWordBooks } from "@/lib/api/word-books/get-all-books";

export default function WordBookListPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      <WordBookList wordbooks={data ?? []} />
      <div className="fixed bottom-6 right-6 z-50">
        <PlusButton onClick={() => setIsCreateModalOpen(true)} />
      </div>
      <CreateWordBookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
