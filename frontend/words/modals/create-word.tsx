"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
import { Button } from "@/frontend/core/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/frontend/core/components/ui/tooltip";
import { Sparkles, Undo2 } from "lucide-react";
import {
  createWordSchema,
  type CreateWordRequest,
} from "@/lib/api/words/create-word";
import { useCreateWord } from "@/frontend/words/hooks/useCreateWord";
import { useParams } from "next/navigation";
import WordInput from "@/frontend/words/components/create-word/word-input";
import AiSearch from "@/frontend/words/components/create-word/ai-search";
import type { DictionaryEntryResponse } from "@/lib/api/types/dictionary";
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
  const [activeTab, setActiveTab] = useState<"self" | "ai">("self");

  const form = useForm<WordFormData>({
    resolver: zodResolver(createWordSchema),
    defaultValues: {
      bookId,
      japanese: "",
      meaning: "",
      pronunciation: "",
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

  const onSelected = (result: DictionaryEntryResponse) => {
    form.setValue("japanese", result.japanese);
    form.setValue("meaning", result.meaning);
    form.setValue("pronunciation", result.pronunciation);
    setActiveTab("self");
  };

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
      <DialogContent className="min-h-96">
        <DialogHeader className="h-3 flex flex-row items-center justify-between">
          <DialogTitle>단어 추가</DialogTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setActiveTab(activeTab === "self" ? "ai" : "self")
                }
                className="mr-4"
              >
                {activeTab === "ai" ? (
                  <Undo2 className="h-5 w-5" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{activeTab === "ai" ? "입력으로" : "AI 검색"}</p>
            </TooltipContent>
          </Tooltip>
        </DialogHeader>
        {activeTab === "self" ? (
          <WordInput
            form={form}
            createMutation={createMutation}
            onSubmit={onSubmit}
            onClose={handleClose}
          />
        ) : (
          <AiSearch onSelected={onSelected} />
        )}
      </DialogContent>
    </Dialog>
  );
}
