import KanjiBookDetail from "@/frontend/kanjis/pages/kanjibook-detail";

export default async function KanjiBookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <KanjiBookDetail id={id} />;
}
