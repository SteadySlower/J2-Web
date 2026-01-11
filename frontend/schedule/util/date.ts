import { DateTime } from "luxon";
import type { DateRange } from "react-day-picker";

/**
 * 오늘 이전 날짜를 비활성화하는 함수
 * react-day-picker의 disabled prop에 사용됩니다.
 */
export function disabledDates(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateToCheck = new Date(date);
  dateToCheck.setHours(0, 0, 0, 0);
  return dateToCheck < today;
}

/**
 * 날짜 범위를 일수로 변환 (미래 날짜 기준)
 * @param range 선택된 날짜 범위
 * @returns 학습 기간 일수 (0 이상)
 */
export function calculateStudyDays(range: DateRange | undefined): number {
  if (!range?.from || !range?.to) return 2;
  const from = DateTime.fromJSDate(range.from).startOf("day");
  const to = DateTime.fromJSDate(range.to).startOf("day");
  const days = Math.floor(to.diff(from, "days").days);
  return Math.max(0, days);
}

/**
 * 선택된 날짜들을 일수 배열로 변환 (미래 날짜 기준)
 * @param dates 선택된 날짜 배열
 * @returns 복습 기간 일수 배열 (양의 정수만, 정렬됨)
 */
export function calculateReviewDays(dates: Date[]): number[] {
  const today = DateTime.now().startOf("day");
  return dates
    .map((date) => {
      const dateTime = DateTime.fromJSDate(date).startOf("day");
      return Math.floor(dateTime.diff(today, "days").days);
    })
    .filter((days) => days > 0)
    .sort((a, b) => a - b);
}
