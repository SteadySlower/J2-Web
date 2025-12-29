"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import WordList from "@/frontend/words/components/word-list/list";
import CreateWordModal from "@/frontend/words/modals/create-word";
import { useQuery } from "@tanstack/react-query";
import { getBookDetail } from "@/lib/api/word-books/get-book-detail";
import FloatingButtons from "@/frontend/core/components/units/floating-buttons";
import { useToggleShowFront } from "@/frontend/words/hooks/useToggleShowFront";

type WordBookDetailProps = {
  id: string;
};

export default function WordBookDetail({ id }: WordBookDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shuffledWordIds, setShuffledWordIds] = useState<string[]>([]);
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();
  const router = useRouter();

  const isFilterGraduated = searchParams.get("filterGraduated") === "true";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["word-books", id],
    queryFn: () => getBookDetail(id),
  });

  const toggleShowFrontMutation = useToggleShowFront({
    wordbookId: id,
    onSuccess: () => {
      setRevealedMap({});
    },
  });

  const handleToggleShowFront = () => {
    if (!data) return;
    toggleShowFrontMutation.mutate(!data.showFront);
  };

  const handleToggleReveal = (wordId: string) => {
    setRevealedMap((prev) => ({
      ...prev,
      [wordId]: !prev[wordId],
    }));
  };

  const handleWordCreated = (id: string) => {
    setShuffledWordIds((prev) => {
      if (prev.length === 0) return prev;
      return [id, ...prev];
    });
  };

  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams);
    const changedFilter = !isFilterGraduated;
    if (changedFilter) {
      params.set("filterGraduated", "true");
    } else {
      params.delete("filterGraduated");
    }
    setRevealedMap({});
    router.replace(`/word-books/${id}?${params.toString()}`, { scroll: false });
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
      <h1 className="h-16 text-center text-2xl font-bold p-4">{data.title}</h1>
      <WordList
        showFront={data.showFront}
        revealedMap={revealedMap}
        words={data.words}
        shuffledWordIds={shuffledWordIds}
        isFilterGraduated={isFilterGraduated}
        onToggleReveal={handleToggleReveal}
      />
      <FloatingButtons
        isFilterGraduated={isFilterGraduated}
        showFront={data.showFront}
        showFrontTooltipText={
          data.showFront ? "한국어 제시어 보기" : "일본어 제시어 보기"
        }
        plusButtonTooltipText="단어 추가"
        onToggleShowFront={handleToggleShowFront}
        onFilterChange={handleFilterChange}
        onShuffle={handleShuffle}
        onAddWord={() => setIsModalOpen(true)}
      />
      <CreateWordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleWordCreated}
      />
    </div>
  );
}
