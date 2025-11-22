"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import WordList from "@/frontend/words/components/word-list/list";
import PlusButton from "@/frontend/core/components/plus-button";
import CreateWordModal from "@/frontend/words/modals/create-word";
import { useQuery } from "@tanstack/react-query";
import { getBookDetail } from "@/lib/api/word-books/get-book-detail";
import { Switch } from "@/frontend/core/components/ui/switch";
import { Label } from "@/frontend/core/components/ui/label";
import { Shuffle } from "lucide-react";
import { Button } from "@/frontend/core/components/ui/button";

type WordBookDetailProps = {
  id: string;
};

export default function WordBookDetail({ id }: WordBookDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shuffledWordIds, setShuffledWordIds] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isFilterGraduated = searchParams.get("filterGraduated") === "true";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["word-books", id],
    queryFn: () => getBookDetail(id),
  });

  const handleWordCreated = (id: string) => {
    setShuffledWordIds((prev) => {
      if (prev.length === 0) return prev;
      return [id, ...prev];
    });
  };

  const handleFilterChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set("filterGraduated", "true");
    } else {
      params.delete("filterGraduated");
    }
    router.push(`/word-books/${id}?${params.toString()}`, { scroll: false });
  };

  const handleShuffle = () => {
    if (!data) return;
    const wordsToShuffle = isFilterGraduated
      ? data.words.filter((word) => word.status !== "learned")
      : data.words;
    const shuffled = [...wordsToShuffle].sort(() => Math.random() - 0.5);
    setShuffledWordIds(shuffled.map((word) => word.id));
  };

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
    <div className="mx-auto max-w-[900px]">
      <h1 className="text-center text-2xl font-bold p-4">{data.title}</h1>
      <div className="flex items-center justify-end gap-2 px-4 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 gap-2 transition-transform hover:scale-105"
            onClick={handleShuffle}
          >
            <Shuffle className="h-4 w-4" />
            <span>순서 섞기</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="graduation-word-filter"
            checked={isFilterGraduated}
            onCheckedChange={handleFilterChange}
          />
          <Label htmlFor="graduation-word-filter">졸업 단어 필터링</Label>
        </div>
      </div>
      <WordList
        words={data.words}
        shuffledWordIds={shuffledWordIds}
        isFilterGraduated={isFilterGraduated}
      />
      <div className="sticky bottom-6 z-50 flex justify-end">
        <PlusButton onClick={() => setIsModalOpen(true)} />
      </div>
      <CreateWordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleWordCreated}
      />
    </div>
  );
}
