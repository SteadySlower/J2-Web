"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BookList from "@/frontend/core/components/book-list/list";
import PlusButton from "@/frontend/core/components/book-list/plus-button";
import Modal from "@/frontend/core/components/modal/Modal";
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="title"
                style={{ display: "block", marginBottom: "8px" }}
              >
                제목
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: errors.title ? "1px solid red" : "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              {errors.title && (
                <div
                  style={{ color: "red", marginTop: "4px", fontSize: "14px" }}
                >
                  {errors.title.message}
                </div>
              )}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input type="checkbox" {...register("showFront")} />
                일본어 앞면
              </label>
            </div>
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
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  cursor: createMutation.isPending ? "not-allowed" : "pointer",
                  opacity: createMutation.isPending ? 0.5 : 1,
                }}
              >
                {createMutation.isPending ? "생성 중..." : "생성"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
