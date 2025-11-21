import type { Word } from "@/lib/types/word";
import { Card, CardHeader } from "@/frontend/core/components/ui/card";

export default function WordCard(word: Word) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{word.japanese}</p>
      </CardHeader>
    </Card>
  );
}
