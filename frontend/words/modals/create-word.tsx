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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/core/components/ui/tabs";
import {
  createWordSchema,
  type CreateWordRequest,
} from "@/lib/api/words/create-word";
import { useCreateWord } from "@/frontend/words/hooks/useCreateWord";
import { useParams } from "next/navigation";
import CreateSelf from "@/frontend/words/components/create-word/create-self";
import CreateAi from "@/frontend/words/components/create-word/create-ai";

type WordFormData = CreateWordRequest;

type CreateWordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
};

export default function CreateWordModal({
  isOpen,
  onClose,
  onCreated,
}: CreateWordModalProps) {
  const params = useParams();
  const bookId = params.id as string;

  const form = useForm<WordFormData>({
    resolver: zodResolver(createWordSchema),
    defaultValues: {
      bookId,
    },
  });

  const { reset } = form;

  const createMutation = useCreateWord({
    bookId,
    onSuccess: (wordId) => {
      onCreated(wordId);
      onClose();
      reset();
    },
  });

  const onSubmit = (data: WordFormData) => {
    createMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    reset();
    createMutation.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader className="h-3">
          <DialogTitle>단어 추가</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="self">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="self">직접 추가</TabsTrigger>
            <TabsTrigger value="ai">AI로 추가</TabsTrigger>
          </TabsList>
          <TabsContent value="self">
            <CreateSelf
              form={form}
              createMutation={createMutation}
              onSubmit={onSubmit}
              onClose={handleClose}
            />
          </TabsContent>
          <TabsContent value="ai">
            <CreateAi />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
