"use client";

import { DateTime } from "luxon";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/frontend/core/components/ui/calendar";

type StudyDaysSelectorProps = {
  studyRange: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  disabledDates: (date: Date) => boolean;
};

export default function StudyDaysSelector({
  studyRange,
  onSelect,
  disabledDates,
}: StudyDaysSelectorProps) {
  // 날짜 범위를 일수로 변환 (미래 날짜 기준)
  const calculateStudyDays = (range: DateRange | undefined): number => {
    if (!range?.from || !range?.to) return 2;
    const from = DateTime.fromJSDate(range.from).startOf("day");
    const to = DateTime.fromJSDate(range.to).startOf("day");
    const days = Math.floor(to.diff(from, "days").days);
    return Math.max(0, days);
  };

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
