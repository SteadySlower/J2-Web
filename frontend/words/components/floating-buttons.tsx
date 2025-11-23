import PlusButton from "@/frontend/core/components/plus-button";
import StatusFilterButton from "@/frontend/words/components/status-filter-button";
import ShuffleButton from "@/frontend/words/components/shuffle-button";

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
      <StatusFilterButton
        isFiltered={isFilterGraduated}
        onClick={onFilterChange}
      />
      <ShuffleButton onClick={onShuffle} />
      <PlusButton tooltipText="단어 추가" onClick={onAddWord} />
    </div>
  );
}
