"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import { Button } from "@/frontend/core/components/ui/button";

type EndReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
};

export default function EndReviewModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: EndReviewModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{message}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 justify-end mt-6">
          <CancelButton onClick={onClose} />
          <Button onClick={handleConfirm}>확인</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
