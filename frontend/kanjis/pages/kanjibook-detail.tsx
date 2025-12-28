"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import KanjiList from "@/frontend/kanjis/components/list";
import { useQuery } from "@tanstack/react-query";
import { getKanjiBookDetail } from "@/lib/api/kanji-books/get-book-detail";

type KanjiBookDetailProps = {
  id: string;
};

export default function KanjiBookDetail({ id }: KanjiBookDetailProps) {
  const [shuffledKanjiIds] = useState<string[]>([]);
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();

  const isFilterGraduated = searchParams.get("filterGraduated") === "true";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["kanji-books", id],
    queryFn: () => getKanjiBookDetail(id),
  });

  const handleToggleReveal = (kanjiId: string) => {
    setRevealedMap((prev) => ({
      ...prev,
      [kanjiId]: !prev[kanjiId],
    }));
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
    </div>
  );
}
