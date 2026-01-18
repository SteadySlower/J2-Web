"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import { Button } from "@/frontend/core/components/ui/button";

type EndReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  learningWordIds: string[];
  type: "word" | "kanji";
};

export default function EndReviewModal({
  isOpen,
  onClose,
  onConfirm,
  learningWordIds,
  type,
}: EndReviewModalProps) {

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleConfirmWithoutMove = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (learningWordIds.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{type === "word" ? "단어장" : "한자장"} 마치기</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {type === "word" ? "단어장" : "한자장"}의 복습을 마치시겠습니까? (오늘 복습 목록에서 보이지 않습니다.)
          </DialogDescription>
          <div className="flex gap-2 justify-end mt-6">
            <CancelButton onClick={handleCancel} />
            <Button onClick={handleConfirm}>확인</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "word" ? "단어장" : "한자장"} 마치기</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          체크되지 않은 {learningWordIds.length}개의 {type === "word" ? "단어" : "한자"}를 다른 {type === "word" ? "단어장" : "한자장"}으로 이동할 수 있습니다. (오늘 복습 목록에서 보이지 않습니다.)
        </DialogDescription>
        <div className="flex gap-2 justify-end mt-6">
          <CancelButton onClick={handleCancel} />
          <Button onClick={handleConfirmWithoutMove}>이동 없이 마치기</Button>
          <Button onClick={handleConfirm}>이동 하고 마치기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
