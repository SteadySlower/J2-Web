"use client";

import { useState } from "react";
import KanjiBookList from "@/frontend/kanji-book/components/list";
import PlusButton from "@/frontend/core/components/plus-button";
import CreateKanjiBookModal from "@/frontend/kanji-book/modals/create-kanjibook";
import { useQuery } from "@tanstack/react-query";
import { fetchKanjiBooks } from "@/lib/api/kanji-books/get-all-books";

export default function KanjiBookListPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["kanji-books"],
    queryFn: fetchKanjiBooks,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return (
      <div>한자장 목록을 불러오지 못했습니다. {(error as Error).message}</div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto">
      <h1 className="h-16 text-center text-2xl font-bold pt-4">한자장 목록</h1>
      <KanjiBookList kanjibooks={data ?? []} />
      <div className="fixed top-20 z-50">
        <PlusButton onClick={() => setIsCreateModalOpen(true)} />
      </div>
      <CreateKanjiBookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
