"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import Input from "@/frontend/core/components/form/input";
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
  const label = useMemo(() => {
    return searchMode === "Japanese"
      ? "일본어"
      : searchMode === "Korean"
      ? "한국어"
      : "일본어 발음 (한글로)";
  }, [searchMode]);

  const {
    register,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      text: "",
    },
  });

  return (
    <div className="flex flex-col gap-4 pt-4">
      <Select
        value={searchMode}
        onValueChange={(v) => setSearchMode(v as SearchMode)}
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
        label={label}
        register={register("text", {
          validate: (v) => {
            const inputValue = v || "";

            if (inputValue.length > 15) {
              return "15자 이하로 입력해주세요.";
            }

            const { isOnlyKorean, isOnlyJapanese } =
              getLanguageFlags(inputValue);

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
        })}
        error={errors.text}
      />
      <div className="flex justify-end">
        <Button
          variant="default"
          size="icon"
          type="submit"
          className="w-12 h-10"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
