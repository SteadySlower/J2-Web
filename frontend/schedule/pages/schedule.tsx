"use client";

import { useState } from "react";
import ScheduleList from "../components/schedule-list";
import SettingButton from "../components/setting-button";
import ResetReviewButton from "../components/reset-review-button";
import EditScheduleModal from "../modals/edit-schedule";

export default function Schedule() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="max-w-[900px] mx-auto my-16">
      <ScheduleList />
      <div className="fixed top-35 z-50 flex flex-col gap-2">
        <SettingButton tooltipText="스케줄 설정" onClick={() => setIsEditModalOpen(true)} />
        <ResetReviewButton
          tooltipText="복습 스케줄 리셋"
          onClick={() => {}}
        />
      </div>
      <EditScheduleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
