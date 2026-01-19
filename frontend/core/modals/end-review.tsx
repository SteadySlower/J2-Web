"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/frontend/core/components/ui/dialog";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import { Button } from "@/frontend/core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/core/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWordBooks } from "@/lib/api/word-books/get-all-books";
import { fetchKanjiBooks } from "@/lib/api/kanji-books/get-all-books";
import { moveWords } from "@/lib/api/word-books/move-words";
import { moveKanjis } from "@/lib/api/kanji-books/move-kanjis";
import toast from "react-hot-toast";

type EndReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  learningWordIds: string[];
  type: "word" | "kanji";
  sourceBookId: string;
};

export default function EndReviewModal({
  isOpen,
  onClose,
  onConfirm,
  learningWordIds,
  type,
  sourceBookId,
}: EndReviewModalProps) {
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: wordBooks, isLoading: isLoadingWordBooks } = useQuery({
    queryKey: ["word-books"],
    queryFn: fetchWordBooks,
    enabled: isOpen && type === "word",
  });

  const { data: kanjiBooks, isLoading: isLoadingKanjiBooks } = useQuery({
    queryKey: ["kanji-books"],
    queryFn: fetchKanjiBooks,
    enabled: isOpen && type === "kanji",
  });

  const books = type === "word" ? wordBooks : kanjiBooks;
  const isLoading = type === "word" ? isLoadingWordBooks : isLoadingKanjiBooks;
  const availableBooks = books?.filter((book) => book.id !== sourceBookId) ?? [];

  const moveMutation = useMutation({
    mutationFn: async (targetBookId: string) => {
      if (type === "word") {
        return moveWords(sourceBookId, {
          target_book_id: targetBookId,
          word_ids: learningWordIds,
        });
      } else {
        return moveKanjis(sourceBookId, {
          target_book_id: targetBookId,
          kanji_ids: learningWordIds,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type === "word" ? "word-books" : "kanji-books", sourceBookId] });
      queryClient.invalidateQueries({ queryKey: [type === "word" ? "word-books" : "kanji-books"] });
      toast.success(`${type === "word" ? "단어" : "한자"}가 이동되었습니다!`);
      onConfirm();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || `${type === "word" ? "단어" : "한자"} 이동에 실패했습니다.`);
    },
  });

  const handleConfirm = () => {
    if (selectedBookId) {
      moveMutation.mutate(selectedBookId);
    }
  };

  const handleConfirmWithoutMove = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    setSelectedBookId("");
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
            {type === "word" ? "단어장" : "한자장"}의 복습을 마치시겠습니까? (이 단어장은 오늘 복습 목록에서 보이지 않습니다.)
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "word" ? "단어장" : "한자장"} 마치기</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          체크되지 않은 {learningWordIds.length}개의 {type === "word" ? "단어" : "한자"}를 다른 {type === "word" ? "단어장" : "한자장"}으로 이동할 수 있습니다. (이 단어장은 오늘 복습 목록에서 보이지 않습니다.)
        </DialogDescription>
        <div className="mt-4">
          <label className="text-sm font-medium mb-2 block">
            이동할 {type === "word" ? "단어장" : "한자장"} 선택:
          </label>
          <Select
            value={selectedBookId}
            onValueChange={setSelectedBookId}
            disabled={isLoading || moveMutation.isPending}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`${type === "word" ? "단어장" : "한자장"}을 선택하세요`} />
            </SelectTrigger>
            <SelectContent side="bottom" className="bg-white max-h-[200px]">
              {availableBooks.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  이동할 수 있는 {type === "word" ? "단어장" : "한자장"}이 없습니다
                </div>
              ) : (
                availableBooks.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <CancelButton onClick={handleCancel} disabled={moveMutation.isPending} />
          <Button onClick={handleConfirmWithoutMove} disabled={moveMutation.isPending}>
            이동 없이 마치기
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={moveMutation.isPending || (availableBooks.length > 0 && selectedBookId === "")}
          >
            {moveMutation.isPending
              ? "이동 중..."
              : availableBooks.length === 0
              ? "마치기"
              : "이동 하고 마치기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
