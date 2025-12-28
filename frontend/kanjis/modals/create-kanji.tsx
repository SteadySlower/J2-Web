"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
import {
  createKanjiSchema,
  type CreateKanjiRequest,
} from "@/lib/api/kanjis/create-kanji";
import { useCreateKanji } from "@/frontend/kanjis/hooks/useCreateKanji";
import { useParams } from "next/navigation";
import KanjiInput from "@/frontend/kanjis/components/kanji-input";

type KanjiFormData = CreateKanjiRequest;

type CreateKanjiModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
};

export default function CreateKanjiModal({
  isOpen,
  onClose,
  onCreated,
}: CreateKanjiModalProps) {
  const params = useParams();
  const kanjibookId = params.id as string;

  const form = useForm<KanjiFormData>({
    resolver: zodResolver(createKanjiSchema),
    defaultValues: {
      kanji_book_id: kanjibookId,
    },
  });

  const { reset } = form;

  const createMutation = useCreateKanji({
    bookId: kanjibookId,
    onSuccess: (kanjiId) => {
      onCreated(kanjiId);
      onClose();
      reset();
    },
  });

  const onSubmit = (data: KanjiFormData) => {
    createMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    reset();
    createMutation.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="min-h-96">
        <DialogHeader>
          <DialogTitle>한자 추가</DialogTitle>
        </DialogHeader>
        <KanjiInput
          form={form}
          createMutation={createMutation}
          onSubmit={onSubmit}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
