"use client";

import { useState, useCallback } from "react";
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
import Form from "@/frontend/core/components/form/form";
import SearchStep from "@/frontend/kanjis/components/create-kanji/search-step";
import InputStep from "@/frontend/kanjis/components/create-kanji/input-step";

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
  const [step, setStep] = useState<"search" | "input">("search");
  const [character, setCharacter] = useState<string>("");

  const form = useForm<KanjiFormData>({
    resolver: zodResolver(createKanjiSchema),
    defaultValues: {
      kanji_book_id: kanjibookId,
    },
  });

  const { handleSubmit, reset } = form;

  const resetToSearch = () => {
    setStep("search");
    setCharacter("");
    reset({
      kanji_book_id: kanjibookId,
      character: "",
      meaning: "",
      on_reading: "",
      kun_reading: "",
    });
  };

  const createMutation = useCreateKanji({
    bookId: kanjibookId,
    onSuccess: (kanjiId) => {
      onCreated(kanjiId);
      onClose();
      resetToSearch();
    },
  });

  const onSubmit = (data: KanjiFormData) => {
    createMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    createMutation.reset();
    resetToSearch();
  };

  const handleCharacterSet = (newCharacter: string) => {
    setCharacter(newCharacter);
  };

  const handleSearchSuccess = useCallback(() => {
    setStep("input");
  }, []);

  const handleCharacterClick = () => {
    resetToSearch();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>한자 추가</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {step === "search" ? (
            <SearchStep
              form={form}
              character={character}
              onCharacterSet={handleCharacterSet}
              onSearchSuccess={handleSearchSuccess}
              onClose={handleClose}
            />
          ) : (
            <InputStep
              form={form}
              character={character}
              mutation={createMutation}
              onCharacterClick={handleCharacterClick}
              onClose={handleClose}
            />
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
