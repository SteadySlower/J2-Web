"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import Modal from "@/frontend/core/components/modal/Modal";
import Form from "@/frontend/core/components/form/form";
import Input from "@/frontend/core/components/form/input";
import Checkbox from "@/frontend/core/components/form/checkbox";
import SubmitButton from "@/frontend/core/components/form/submit-button";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWordBook } from "@/lib/api/word-books/create-book";
import type { WordBookListItem } from "@/lib/api/word-books/get-all-books";

const wordBookSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  showFront: z.boolean(),
});

type WordBookFormData = z.infer<typeof wordBookSchema>;

type CreateWordBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateWordBookModal({
  isOpen,
  onClose,
}: CreateWordBookModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WordBookFormData>({
    resolver: zodResolver(wordBookSchema),
    defaultValues: {
      showFront: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: createWordBook,
    onMutate: async (newBook) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["word-books"] });

      // 이전 데이터 백업
      const previousBooks = queryClient.getQueryData<WordBookListItem[]>([
        "word-books",
      ]);

      // 낙관적 업데이트: 임시 데이터 추가
      const optimisticBook: WordBookListItem = {
        id: `temp-${Date.now()}`,
        title: newBook.title,
        createdAt: DateTime.now(),
        href: `/word-books/temp-${Date.now()}`,
      };

      queryClient.setQueryData<WordBookListItem[]>(
        ["word-books"],
        (old = []) => [optimisticBook, ...old]
      );

      // 롤백을 위한 컨텍스트 반환
      return { previousBooks };
    },
    onSuccess: (data) => {
      // 서버 응답으로 실제 데이터로 교체
      queryClient.setQueryData<WordBookListItem[]>(
        ["word-books"],
        (old = []) => {
          // 임시 데이터 제거하고 실제 데이터 추가
          const filtered = old.filter((book) => !book.id.startsWith("temp-"));
          return [
            {
              id: data.id,
              title: data.title,
              createdAt: DateTime.fromISO(data.createdAt),
              href: `/word-books/${data.id}`,
            },
            ...filtered,
          ];
        }
      );
      toast.success("단어장이 생성되었습니다!");
      onClose();
      reset();
    },
    onError: (error: Error, _newBook, context) => {
      // 롤백: 이전 데이터로 복원
      if (context?.previousBooks) {
        queryClient.setQueryData(["word-books"], context.previousBooks);
      }
      toast.error(error.message || "단어장 생성에 실패했습니다.");
    },
  });

  const onSubmit = (data: WordBookFormData) => {
    createMutation.mutate(data);
  };

  const handleClose = () => {
    onClose();
    reset();
    createMutation.reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div>
        <h2>단어장 생성</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="제목"
            register={register("title")}
            error={errors.title}
            type="text"
          />
          <Checkbox
            label="일본어 앞면"
            register={register("showFront")}
            error={errors.showFront}
          />
          {createMutation.isError && (
            <div style={{ color: "red", marginBottom: "16px" }}>
              {(createMutation.error as Error).message}
            </div>
          )}
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            <CancelButton onClick={handleClose} />
            <SubmitButton
              isLoading={createMutation.isPending}
              loadingText="생성 중..."
            >
              생성
            </SubmitButton>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
