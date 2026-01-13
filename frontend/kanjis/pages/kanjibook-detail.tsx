"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import KanjiList from "@/frontend/kanjis/components/list";
import CreateKanjiModal from "@/frontend/kanjis/modals/create-kanji";
import FloatingButtons from "@/frontend/core/components/units/floating-buttons";
import { useQuery } from "@tanstack/react-query";
import { getKanjiBookDetail } from "@/lib/api/kanji-books/get-book-detail";
import { useToggleShowFront } from "@/frontend/kanjis/hooks/useToggleShowFront";
import EndReviewModal from "@/frontend/core/modals/end-review";

type KanjiBookDetailProps = {
  id: string;
};

export default function KanjiBookDetail({ id }: KanjiBookDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEndReviewModalOpen, setIsEndReviewModalOpen] = useState(false);
  const [shuffledKanjiIds, setShuffledKanjiIds] = useState<string[]>([]);
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();
  const router = useRouter();

  const isFilterGraduated = searchParams.get("filterGraduated") === "true";
  const isReviewMode = searchParams.get("mode") === "review";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["kanji-books", id],
    queryFn: () => getKanjiBookDetail(id),
  });

  const toggleShowFrontMutation = useToggleShowFront({
    kanjibookId: id,
    onSuccess: () => {
      setRevealedMap({});
    },
  });

  const handleToggleShowFront = () => {
    if (!data) return;
    toggleShowFrontMutation.mutate(!data.showFront);
  };

  const handleToggleReveal = (kanjiId: string) => {
    setRevealedMap((prev) => ({
      ...prev,
      [kanjiId]: !prev[kanjiId],
    }));
  };

  const handleKanjiCreated = (id: string) => {
    setShuffledKanjiIds((prev) => {
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
    router.replace(`/kanji-books/${id}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleShuffle = () => {
    if (!data) return;
    const kanjisToShuffle = isFilterGraduated
      ? data.kanjis.filter((kanji) => kanji.status !== "learned")
      : data.kanjis;
    const shuffled = [...kanjisToShuffle].sort(() => Math.random() - 0.5);
    setShuffledKanjiIds(shuffled.map((kanji) => kanji.id));
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>한자장을 불러오지 못했습니다. {(error as Error).message}</div>;
  }

  if (!data) {
    return <div>한자장을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <h1 className="h-16 text-center text-2xl font-bold p-4">{data.title}</h1>
      <KanjiList
        showFront={data.showFront}
        revealedMap={revealedMap}
        kanjis={data.kanjis}
        shuffledKanjiIds={shuffledKanjiIds}
        isFilterGraduated={isFilterGraduated}
        onToggleReveal={handleToggleReveal}
      />
      <FloatingButtons
        isFilterGraduated={isFilterGraduated}
        showFront={data.showFront}
        showFrontTooltipText={
          data.showFront ? "의미 보기 모드" : "한자 보기 모드"
        }
        showFrontButtonText={data.showFront ? "한" : "漢"}
        plusButtonTooltipText="한자 추가"
        onToggleShowFront={handleToggleShowFront}
        onFilterChange={handleFilterChange}
        onShuffle={handleShuffle}
        onAddWord={() => setIsModalOpen(true)}
        onReviewEnded={
          isReviewMode ? () => setIsEndReviewModalOpen(true) : undefined
        }
      />
      <CreateKanjiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleKanjiCreated}
      />
      {isReviewMode && (
        <EndReviewModal
          isOpen={isEndReviewModalOpen}
          onClose={() => setIsEndReviewModalOpen(false)}
          onConfirm={() => alert("복습 완료")}
          message="한자장의 복습을 마치시겠습니까?"
        />
      )}
    </div>
  );
}
