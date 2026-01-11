"use client";

import { DateTime } from "luxon";
import { Calendar } from "@/frontend/core/components/ui/calendar";

type ReviewDaysSelectorProps = {
  reviewDates: Date[];
  onSelect: (dates: Date[] | undefined) => void;
  disabledDates: (date: Date) => boolean;
};

export default function ReviewDaysSelector({
  reviewDates,
  onSelect,
  disabledDates,
}: ReviewDaysSelectorProps) {
  // 선택된 날짜들을 일수 배열로 변환 (미래 날짜 기준)
  const calculateReviewDays = (dates: Date[]): number[] => {
    const today = DateTime.now().startOf("day");
    return dates
      .map((date) => {
        const dateTime = DateTime.fromJSDate(date).startOf("day");
        return Math.floor(dateTime.diff(today, "days").days);
      })
      .filter((days) => days > 0)
      .sort((a, b) => a - b);
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        오늘 추가한 단어장/한자장을 언제 복습할지 날짜를 선택하세요.
      </p>
      <Calendar
        mode="multiple"
        selected={reviewDates}
        onSelect={(dates) => onSelect(dates || undefined)}
        disabled={disabledDates}
        numberOfMonths={2}
      />
      {reviewDates.length > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm mb-2">선택된 날짜:</p>
          <div className="flex flex-wrap gap-2">
            {reviewDates
              .sort((a, b) => a.getTime() - b.getTime())
              .map((date, idx) => {
                const days = calculateReviewDays([date])[0];
                return (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-background rounded text-sm"
                  >
                    {days}일 후
                  </span>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
