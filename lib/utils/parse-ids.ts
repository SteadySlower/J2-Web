/**
 * ids 쿼리 파라미터를 파싱하고 정규화합니다.
 * 성능 최적화:
 * - 서버 컴포넌트에서 한 번만 파싱
 * - 정렬 및 중복 제거로 불필요한 리렌더링 방지
 * - 빈 배열 조기 반환으로 불필요한 API 호출 방지
 */
export function parseAndNormalizeIds(
  idsParam: string | string[] | undefined,
): string[] {
  if (!idsParam) {
    return [];
  }

  const idsArray = Array.isArray(idsParam) ? idsParam : [idsParam];

  // 중복 제거 및 정규화
  const normalizedIds = Array.from(
    new Set(
      idsArray
        .flatMap((id) => id.split(","))
        .map((id) => id.trim())
        .filter((id) => id.length > 0),
    ),
  ).sort();

  return normalizedIds;
}
