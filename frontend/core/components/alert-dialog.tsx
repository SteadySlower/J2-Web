"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/frontend/core/components/ui/alert-dialog";

type ConfirmAlertDialogProps = {
  title: string;
  description: string;
  actionButtonLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionButtonClicked: () => void;
};

export default function ConfirmAlertDialog({
  title,
  description,
  actionButtonLabel,
  open,
  onOpenChange,
  onActionButtonClicked,
}: ConfirmAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={onActionButtonClicked}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {actionButtonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
