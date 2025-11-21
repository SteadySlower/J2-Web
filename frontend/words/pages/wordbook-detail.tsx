"use client";

import { useState } from "react";
import WordList from "@/frontend/words/components/word-list/list";
import PlusButton from "@/frontend/core/components/plus-button";
import CreateWordModal from "@/frontend/words/modals/create-word";
import { useQuery } from "@tanstack/react-query";
import { getBookDetail } from "@/lib/api/word-books/get-book-detail";

type WordBookDetailProps = {
  id: string;
};

export default function WordBookDetail({ id }: WordBookDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["word-books", id],
    queryFn: () => getBookDetail(id),
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>단어장을 불러오지 못했습니다. {(error as Error).message}</div>;
  }

  if (!data) {
    return <div>단어장을 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <h1 className="text-center text-2xl font-bold p-4">{data.title}</h1>
      <WordList words={data.words} wordbookId={id} />
      <PlusButton onClick={() => setIsModalOpen(true)} />
      <CreateWordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookId={id}
      />
    </>
  );
}
