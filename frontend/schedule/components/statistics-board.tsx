"use client";

import { VictoryPie } from "victory";
import SettingButton from "./setting-button";
import ResetReviewButton from "./reset-review-button";
import TodayWordsButton from "@/frontend/core/components/units/today-button";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";

type StatisticsBoardProps = {
  total: number;
  learning: number;
  learned: number;
  reviewDate: string;
  studyWordBookIds: string[];
  studyKanjiBookIds: string[];
  onSettingClick: () => void;
  onResetClick: () => void;
};

export default function StatisticsBoard({
  total,
  learning,
  learned,
  reviewDate,
  studyWordBookIds,
  studyKanjiBookIds,
  onSettingClick,
  onResetClick,
}: StatisticsBoardProps) {
  const router = useRouter();

  const chartData = [
    { x: "학습 중", y: learning },
    { x: "학습 완료", y: learned },
  ].filter((item) => item.y > 0);

  const learningRate = total > 0 ? Math.round((learned / total) * 100) : 0;

  const reviewDateTime = DateTime.fromISO(reviewDate).startOf("day");
  const today = DateTime.now().startOf("day");
  const daysDiff = Math.floor(today.diff(reviewDateTime, "days").days);
  const isToday = daysDiff === 0;

  const getDaysAgoText = (days: number) => {
    if (days === 1) return "어제";
    return `${days}일 전`;
  };

  const handleTodayWordsClick = () => {
    if (studyWordBookIds.length === 0) return;
    const idsParam = studyWordBookIds.join(",");
    router.push(`/today?ids=${idsParam}`);
  };

  return (
    <div className="relative grid grid-cols-[1fr_1.5fr] gap-8 bg-white rounded-lg shadow-md px-4 mx-16 mb-8">
      <div
        className={`absolute top-4 left-4 text-3xl font-bold ${isToday ? "text-primary" : "text-red-500"}`}
      >
        {reviewDateTime.toFormat("M월 d일")}
        {!isToday && ` (${getDaysAgoText(daysDiff)})`}
      </div>
      <div className="relative">
        <VictoryPie
          data={chartData}
          colorScale={["#ef4444", "#10b981"]}
          innerRadius={60}
          width={200}
          height={200}
          labels={() => null}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {learningRate}%
            </div>
            <div className="text-sm text-gray-500">학습률</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            📚 전체 단어
          </span>
          <span className="text-lg font-semibold text-gray-900">{total}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            ⏳ 아직 못 외운 단어
          </span>
          <span className="text-lg font-semibold text-red-600">{learning}</span>
        </div>
      </div>
      <div></div>
      <div className="flex flex-row gap-2 justify-end items-end pb-4">
        {studyWordBookIds.length > 0 && (
          <TodayWordsButton onClick={handleTodayWordsClick} type="word" />
        )}
        {studyKanjiBookIds.length > 0 && (
          <TodayWordsButton onClick={() => {}} type="kanji" />
        )}
        <ResetReviewButton tooltipText="스케줄 리셋" onClick={onResetClick} />
        <SettingButton tooltipText="스케줄 설정" onClick={onSettingClick} />
      </div>
    </div>
  );
}
