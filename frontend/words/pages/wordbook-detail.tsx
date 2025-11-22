"use client";

import { useState } from "react";
import WordList from "@/frontend/words/components/word-list/list";
import PlusButton from "@/frontend/core/components/plus-button";
import CreateWordModal from "@/frontend/words/modals/create-word";
import { useQuery } from "@tanstack/react-query";
import { getBookDetail } from "@/lib/api/word-books/get-book-detail";
import { Switch } from "@/frontend/core/components/ui/switch";
import { Label } from "@/frontend/core/components/ui/label";

type WordBookDetailProps = {
  id: string;
};

export default function WordBookDetail({ id }: WordBookDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterGraduated, setIsFilterGraduated] = useState(false);

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

  const filteredWords = isFilterGraduated
    ? data.words.filter((word) => word.status !== "learned")
    : data.words;

  return (
    <div className="mx-auto max-w-[800px]">
      <h1 className="text-center text-2xl font-bold p-4">{data.title}</h1>
      <div className="flex items-center justify-end gap-2 px-4 pb-4">
        <Switch
          id="graduation-word-filter"
          checked={isFilterGraduated}
          onCheckedChange={setIsFilterGraduated}
        />
        <Label htmlFor="graduation-word-filter">졸업 단어 필터링</Label>
      </div>
      <WordList words={filteredWords} />
      <PlusButton onClick={() => setIsModalOpen(true)} />
      <CreateWordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
