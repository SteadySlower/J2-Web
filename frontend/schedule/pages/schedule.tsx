"use client";

import { useState } from "react";
import ScheduleList from "../components/schedule-list";
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
    <div className="max-w-6xl min-w-4xl mx-auto my-16">
      <ScheduleList
        onSettingClick={() => setIsEditModalOpen(true)}
        onResetClick={() => setIsResetConfirmOpen(true)}
      />
      <EditScheduleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      <ConfirmAlertDialog
        title="스케줄 리셋"
        description="오늘 스케줄로 리셋합니다."
        actionButtonLabel="리셋"
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        onActionButtonClicked={() => resetReviewMutation.mutate()}
      />
    </div>
  );
}
