import PlusButton from "@/frontend/core/components/plus-button";
import CheckFilterButton from "@/frontend/words/components/check-filter-button";
import ShuffleButton from "@/frontend/words/components/shuffle-button";
import { cn } from "@/lib/utils";

type FloatingButtonsProps = {
  isFilterGraduated: boolean;
  onFilterChange: () => void;
  onShuffle: () => void;
  onAddWord: () => void;
};

export default function FloatingButtons({
  isFilterGraduated,
  onFilterChange,
  onShuffle,
  onAddWord,
}: FloatingButtonsProps) {
  return (
    <div className="fixed top-20 z-50 flex flex-col items-end justify-end gap-2">
      <CheckFilterButton
        tooltipText={isFilterGraduated ? "체크 필터 끄기" : "체크 필터 켜기"}
        onClick={onFilterChange}
        className={cn(
          isFilterGraduated
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 hover:bg-gray-500"
        )}
      />
      <ShuffleButton onClick={onShuffle} />
      <PlusButton tooltipText="단어 추가" onClick={onAddWord} />
    </div>
  );
}
