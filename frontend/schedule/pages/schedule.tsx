"use client";

import { useState } from "react";
import ScheduleList from "../components/schedule-list";
import SettingButton from "../components/setting-button";
import EditScheduleModal from "../modals/edit-schedule";

export default function Schedule() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="max-w-[900px] mx-auto my-16">
      <ScheduleList />
      <div className="fixed top-35 z-50">
        <SettingButton onClick={() => setIsEditModalOpen(true)} />
      </div>
      <EditScheduleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
