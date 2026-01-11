"use client";

import type { DateRange } from "react-day-picker";
import { Calendar } from "@/frontend/core/components/ui/calendar";
import {
  disabledDates,
  calculateStudyDays,
} from "@/frontend/schedule/util/date";

type StudyDaysSelectorProps = {
  studyRange: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
};

export default function StudyDaysSelector({
  studyRange,
  onSelect,
}: StudyDaysSelectorProps) {
  return (
    <div>
      <p className="text-base text-foreground mb-4">
        오늘 추가한 단어장/한자장을 언제까지 학습할까요?.
      </p>
      <Calendar
        mode="range"
        selected={studyRange}
        onSelect={onSelect}
        disabled={disabledDates}
        numberOfMonths={2}
      />
      {studyRange?.from && studyRange?.to && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            학습 기간: {calculateStudyDays(studyRange)}일 후까지
          </p>
        </div>
      )}
    </div>
  );
}
