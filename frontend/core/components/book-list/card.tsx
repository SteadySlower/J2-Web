import { DateTime } from "luxon";

type BookCardProps = {
  title: string;
  createdAt: DateTime;
};

export default function BookCard({ title, createdAt }: BookCardProps) {
  const now = DateTime.now();
  const daysDiff = Math.floor(now.diff(createdAt, "days").days);
  const daysAgo = daysDiff === 0 ? "오늘" : `${daysDiff}일전`;

  return (
    <div>
      <h3>{title}</h3>
      <p>{daysAgo}</p>
    </div>
  );
}
