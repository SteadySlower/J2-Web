import { DateTime } from "luxon";
import Link from "next/link";

type BookCardProps = {
  title: string;
  createdAt: DateTime;
  href: string;
};

export default function BookCard({ title, createdAt, href }: BookCardProps) {
  const now = DateTime.now();
  const daysDiff = Math.floor(now.diff(createdAt, "days").days);
  const daysAgo = daysDiff === 0 ? "오늘" : `${daysDiff}일전`;

  const content = (
    <>
      <h3>{title}</h3>
      <p>{daysAgo}</p>
    </>
  );

  return <Link href={href}>{content}</Link>;
}
