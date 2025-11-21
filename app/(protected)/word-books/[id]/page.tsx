import WordBookDetail from "@/frontend/words/pages/wordbook-detail";

export default async function WordBookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WordBookDetail id={id} />;
}
