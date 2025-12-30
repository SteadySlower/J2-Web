import PlusButton from "@/frontend/core/components/plus-button";
import CheckFilterButton from "@/frontend/core/components/units/check-filter-button";
import ShuffleButton from "@/frontend/core/components/units/shuffle-button";
import ShowFrontButton from "@/frontend/core/components/units/showFront-button";
import { cn } from "@/lib/utils";

type FloatingButtonsProps = {
  isFilterGraduated: boolean;
  showFront: boolean;
  showFrontTooltipText: string;
  showFrontButtonText: string;
  plusButtonTooltipText: string;
  onToggleShowFront: () => void;
  onFilterChange: () => void;
  onShuffle: () => void;
  onAddWord: () => void;
};

export default function FloatingButtons({
  isFilterGraduated,
  showFront,
  showFrontTooltipText,
  showFrontButtonText,
  plusButtonTooltipText,
  onToggleShowFront,
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
      <ShowFrontButton
        showFront={showFront}
        tooltipText={showFrontTooltipText}
        buttonText={showFrontButtonText}
        onClick={onToggleShowFront}
      />
      <ShuffleButton onClick={onShuffle} />
      <PlusButton tooltipText={plusButtonTooltipText} onClick={onAddWord} />
    </div>
  );
}
