"use client";

import { VictoryPie } from "victory";
import SettingButton from "./setting-button";
import ResetReviewButton from "./reset-review-button";

type StatisticsBoardProps = {
  total: number;
  learning: number;
  learned: number;
  onSettingClick: () => void;
  onResetClick: () => void;
};

export default function StatisticsBoard({
  total,
  learning,
  learned,
  onSettingClick,
  onResetClick,
}: StatisticsBoardProps) {
  const chartData = [
    { x: "학습 중", y: learning },
    { x: "학습 완료", y: learned },
  ].filter((item) => item.y > 0);

  const learningRate = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <div className="grid grid-cols-[1fr_1.5fr] gap-8 bg-white rounded-lg shadow-md px-4 mx-16 mb-8">
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
      <ResetReviewButton
          tooltipText="스케줄 리셋"
          onClick={onResetClick}
        />
        <SettingButton tooltipText="스케줄 설정" onClick={onSettingClick} />

      </div>
    </div>
  );
}
