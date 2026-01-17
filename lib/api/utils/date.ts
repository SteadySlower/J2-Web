import { DateTime } from "luxon";

/**
 * 클라이언트의 로컬 타임존 기준 현재 날짜를 YYYY-MM-DD 형식으로 가져옵니다.
 * 이 함수는 클라이언트 컴포넌트에서만 호출되므로 브라우저의 로컬 타임존을 사용합니다.
 *
 * @returns 클라이언트의 로컬 타임존 기준 현재 날짜 (YYYY-MM-DD 형식)
 * @throws 현재 날짜를 가져올 수 없을 경우 에러를 던집니다.
 */
export function getCurrentLocalDate(): string {
  const currentDate = DateTime.now().toISODate();
  if (!currentDate) {
    throw new Error("현재 날짜를 가져올 수 없습니다.");
  }
  return currentDate;
}
