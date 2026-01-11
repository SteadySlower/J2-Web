import { DateTime } from "luxon";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/core/components/ui/card";
import EditButton from "@/frontend/core/components/edit-button";
import type { Book } from "./types";
import { useState } from "react";
import { cn } from "@/lib/utils";

type BookCardProps<T extends Book> = {
  book: T;
  onEdit: (book: T) => void;
  href: (book: T) => string;
};

export default function BookCard<T extends Book>({
  book,
  onEdit,
  href,
}: BookCardProps<T>) {
  const now = DateTime.now();
  const daysDiff = Math.floor(now.diff(book.createdAt, "days").days);
  const daysAgo = daysDiff === 0 ? "오늘" : `${daysDiff}일전`;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href(book)}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="hover:shadow-md transition-shadow cursor-pointer relative">
        <div
          className="absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <EditButton
            className={cn(
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none",
              "hover:text-black"
            )}
            onClick={() => onEdit(book)}
          />
        </div>
        <CardHeader>
          <CardTitle>{book.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-end">
          <p className="text-sm text-muted-foreground">{daysAgo}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
