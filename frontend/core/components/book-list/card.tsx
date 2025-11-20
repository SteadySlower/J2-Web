import { DateTime } from "luxon";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/core/components/ui/card";

type BookCardProps = {
  title: string;
  createdAt: DateTime;
  href: string;
};

export default function BookCard({ title, createdAt, href }: BookCardProps) {
  const now = DateTime.now();
  const daysDiff = Math.floor(now.diff(createdAt, "days").days);
  const daysAgo = daysDiff === 0 ? "오늘" : `${daysDiff}일전`;

  return (
    <Link href={href} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{daysAgo}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
