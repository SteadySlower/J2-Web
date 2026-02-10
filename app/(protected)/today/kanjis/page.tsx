import TodayKanjisList from "@/frontend/today/pages/today-kanjis-list";
import { parseAndNormalizeIds } from "@/lib/utils/parse-ids";

export default async function TodayKanjisPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string | string[] }>;
}) {
  const params = await searchParams;
  const ids = parseAndNormalizeIds(params.ids);

  // ids가 없으면 빈 배열을 전달 (컴포넌트에서 처리)
  return <TodayKanjisList ids={ids} />;
}
