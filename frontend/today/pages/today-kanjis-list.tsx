"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import KanjiList from "@/frontend/kanjis/components/list";
import { useQuery } from "@tanstack/react-query";
import { getTodayKanjis } from "@/lib/api/today/get-today-kanjis";
import FloatingButtons from "@/frontend/core/components/units/floating-buttons";

type TodayKanjisListProps = {
  ids: string[];
};

export default function TodayKanjisList({ ids }: TodayKanjisListProps) {
  const [showFront, setShowFront] = useState(true);
  const [shuffledKanjiIds, setShuffledKanjiIds] = useState<string[]>([]);
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();
  const router = useRouter();

  const isFilterGraduated = searchParams.get("filterGraduated") === "true";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["today-kanjis", ids],
    queryFn: () => getTodayKanjis(ids, "learning"),
  });

  const handleToggleShowFront = () => {
    setShowFront((prev) => !prev);
    setRevealedMap({});
  };

  const handleToggleReveal = (kanjiId: string) => {
    setRevealedMap((prev) => ({
      ...prev,
      [kanjiId]: !prev[kanjiId],
    }));
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
    // 현재 경로 유지하면서 쿼리 파라미터만 변경
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleShuffle = () => {
    if (!data) return;
    const kanjisToShuffle = isFilterGraduated
      ? data.filter((kanji) => kanji.status !== "learned")
      : data;
    const shuffled = [...kanjisToShuffle].sort(() => Math.random() - 0.5);
    setShuffledKanjiIds(shuffled.map((kanji) => kanji.id));
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>한자를 불러오지 못했습니다. {(error as Error).message}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 px-10">
        <p className="text-muted-foreground text-lg">학습할 한자가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <h1 className="h-16 text-center text-2xl font-bold p-4">오늘의 한자</h1>
      <KanjiList
        showFront={showFront}
        revealedMap={revealedMap}
        kanjis={data}
        shuffledKanjiIds={shuffledKanjiIds}
        isFilterGraduated={isFilterGraduated}
        onToggleReveal={handleToggleReveal}
      />
      <FloatingButtons
        isFilterGraduated={isFilterGraduated}
        showFront={showFront}
        showFrontTooltipText={
          showFront ? "한국어 제시어 보기" : "일본어 제시어 보기"
        }
        showFrontButtonText={showFront ? "韓" : "日"}
        plusButtonTooltipText=""
        onToggleShowFront={handleToggleShowFront}
        onFilterChange={handleFilterChange}
        onShuffle={handleShuffle}
        onAddWord={undefined}
      />
    </div>
  );
}
