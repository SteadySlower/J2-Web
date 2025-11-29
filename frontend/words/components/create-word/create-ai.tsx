"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import Input from "@/frontend/core/components/form/input";
import Form from "@/frontend/core/components/form/form";
import { Button } from "@/frontend/core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/core/components/ui/select";

type FormValues = {
  text: string;
};

type SearchMode = "Japanese" | "Korean" | "Pronunciation";

function getLanguageFlags(value: string) {
  const isOnlyKorean =
    /^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\p{P}\s]+$/u.test(value);
  const isOnlyJapanese =
    /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\p{P}\s]+$/u.test(value);

  return { isOnlyKorean, isOnlyJapanese };
}

export default function CreateAi() {
  const [searchMode, setSearchMode] = useState<SearchMode>("Japanese");

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      text: "",
    },
  });

  const validateText = useMemo(
    () => (v: string) => {
      const inputValue = v || "";

      if (inputValue.length > 15) {
        return "15자 이하로 입력해주세요.";
      }

      const { isOnlyKorean, isOnlyJapanese } = getLanguageFlags(inputValue);

      if (searchMode === "Japanese") {
        if (!isOnlyJapanese && inputValue.length > 0) {
          return "일본어만 입력해주세요.";
        }
      } else {
        if (!isOnlyKorean && inputValue.length > 0) {
          return "한글만 입력해주세요.";
        }
      }

      return true;
    },
    [searchMode]
  );

  useEffect(() => {
    trigger("text");
  }, [searchMode, trigger]);

  const onSubmit = (data: FormValues) => {
    // TODO: 검색 로직 구현
    console.log("검색:", { searchMode, query: data.text });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 pt-4">
        <Select
          value={searchMode}
          onValueChange={(v) => {
            setSearchMode(v as SearchMode);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="검색 모드 선택" />
          </SelectTrigger>
          <SelectContent className="z-100 bg-background">
            <SelectItem value="Japanese">일본어로 검색</SelectItem>
            <SelectItem value="Korean">한국어로 검색</SelectItem>
            <SelectItem value="Pronunciation">발음으로 검색</SelectItem>
          </SelectContent>
        </Select>
        <Input
          label=""
          register={register("text", {
            validate: validateText,
          })}
          error={errors.text}
        />
        <div className="flex justify-end">
          <Button
            variant="default"
            size="icon"
            type="submit"
            className="w-12 h-10"
            disabled={!isValid}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Form>
  );
}
