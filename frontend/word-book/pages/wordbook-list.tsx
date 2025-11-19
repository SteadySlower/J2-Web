"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BookList from "@/frontend/core/components/book-list/list";
import PlusButton from "@/frontend/core/components/book-list/plus-button";
import Modal from "@/frontend/core/components/modal/Modal";
import Form from "@/frontend/core/components/form/form";
import Input from "@/frontend/core/components/form/input";
import Checkbox from "@/frontend/core/components/form/checkbox";
import SubmitButton from "@/frontend/core/components/form/submit-button";
import CancelButton from "@/frontend/core/components/form/cancel-button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWordBooks } from "@/lib/api/word-books/get-all-books";
import { createWordBook } from "@/lib/api/word-books/create-book";

const wordBookSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  showFront: z.boolean(),
});

type WordBookFormData = z.infer<typeof wordBookSchema>;

export default function WordBookList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["word-books"],
    queryFn: fetchWordBooks,
  });

  const createMutation = useMutation({
    mutationFn: createWordBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["word-books"] });
      setIsModalOpen(false);
      reset();
    },
  });

  const onSubmit = (data: WordBookFormData) => {
    createMutation.mutate(data);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
    createMutation.reset();
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return (
      <div>단어장 목록을 불러오지 못했습니다. {(error as Error).message}</div>
    );
  }

  return (
    <>
      <BookList books={data ?? []} />
      <PlusButton onClick={() => setIsModalOpen(true)} />
      <Modal isOpen={isModalOpen} onClose={handleClose}>
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
    </>
  );
}
