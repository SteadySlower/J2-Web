"use client";

import { useState } from "react";
import ScheduleList from "../components/schedule-list";
import SettingButton from "../components/setting-button";
import ResetReviewButton from "../components/reset-review-button";
import EditScheduleModal from "../modals/edit-schedule";
import ConfirmAlertDialog from "@/frontend/core/components/alert-dialog";
import { useResetReview } from "../hooks/useResetReview";

export default function Schedule() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const resetReviewMutation = useResetReview({
    onSuccess: () => {
      setIsResetConfirmOpen(false);
    },
  });

  return (
    <div className="max-w-[900px] mx-auto my-16">
      <ScheduleList />
      <div className="fixed top-35 z-50 flex flex-col gap-2">
        <SettingButton tooltipText="스케줄 설정" onClick={() => setIsEditModalOpen(true)} />
        <ResetReviewButton
          tooltipText="복습 스케줄 리셋"
          onClick={() => setIsResetConfirmOpen(true)}
        />
      </div>
      <EditScheduleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      <ConfirmAlertDialog
        title="복습 기록 초기화"
        description="모든 복습 기록이 초기화됩니다. 이 작업은 되돌릴 수 없습니다."
        actionButtonLabel="초기화"
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        onActionButtonClicked={() => resetReviewMutation.mutate()}
      />
    </div>
  );
}
