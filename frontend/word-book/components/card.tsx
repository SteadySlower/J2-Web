"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/core/components/ui/card";
import EditButton from "@/frontend/core/components/edit-button";
import EditWordBookModal from "@/frontend/word-book/modals/edit-wordbook";
import type { WordBook } from "@/lib/types/word-books";

type WordBookCardProps = {
  wordbook: WordBook;
};

export default function WordBookCard({ wordbook }: WordBookCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const now = DateTime.now();
  const daysDiff = Math.floor(now.diff(wordbook.createdAt, "days").days);
  const daysAgo = daysDiff === 0 ? "오늘" : `${daysDiff}일전`;

  return (
    <>
      <Link href={`/word-books/${wordbook.id}`} className="block group">
        <Card className="hover:shadow-md transition-shadow cursor-pointer relative">
          <div className="absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <div onClick={(e) => e.preventDefault()}>
              <EditButton onClick={() => setIsEditModalOpen(true)} />
            </div>
          </div>
          <CardHeader>
            <CardTitle>{wordbook.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-end">
            <p className="text-sm text-muted-foreground">{daysAgo}</p>
          </CardContent>
        </Card>
      </Link>
      <EditWordBookModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        wordbook={wordbook}
      />
    </>
  );
}
