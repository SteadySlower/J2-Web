import PlusButton from "@/frontend/core/components/plus-button";
import GraduationButton from "@/frontend/words/components/graduation-button";
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
      <GraduationButton
        isFiltered={isFilterGraduated}
        onClick={onFilterChange}
      />
      <ShuffleButton onClick={onShuffle} />
      <PlusButton tooltipText="단어 추가" onClick={onAddWord} />
    </div>
  );
}
