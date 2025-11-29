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
import { useSearchDictionaryByJp } from "@/frontend/dictionary/hooks/useSearchDictionaryByJp";
import { useSearchDictionaryByMeaning } from "@/frontend/dictionary/hooks/useSearchDictionaryByMeaning";
import { useSearchDictionaryBySound } from "@/frontend/dictionary/hooks/useSearchDictionaryBySound";
import SearchResults from "@/frontend/words/components/create-word/search-results";
import type { DictionaryEntryResponse } from "@/lib/api/types/dictionary";

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

interface AiSearchProps {
  onSelected: (result: DictionaryEntryResponse) => void;
};

export default function AiSearch({ onSelected }: AiSearchProps) {
  const [searchMode, setSearchMode] = useState<SearchMode>("Japanese");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const jpQuery = useSearchDictionaryByJp(
    searchQuery,
    searchMode === "Japanese" && !!searchQuery
  );
  const meaningQuery = useSearchDictionaryByMeaning(
    searchQuery,
    searchMode === "Korean" && !!searchQuery
  );
  const soundQuery = useSearchDictionaryBySound(
    searchQuery,
    searchMode === "Pronunciation" && !!searchQuery
  );

  const searchResults =
    searchMode === "Japanese"
      ? jpQuery.data || []
      : searchMode === "Korean"
      ? meaningQuery.data || []
      : soundQuery.data || [];

  const isLoading =
    searchMode === "Japanese"
      ? jpQuery.isLoading
      : searchMode === "Korean"
      ? meaningQuery.isLoading
      : soundQuery.isLoading;

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
    setSearchQuery(data.text);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 pt-4">
        <Select
          value={searchMode}
          onValueChange={(v) => {
            setSearchMode(v as SearchMode);
            setSearchQuery("");
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
            disabled={!isValid || isLoading}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
        {isLoading && (
          <div className="text-sm text-muted-foreground">검색 중...</div>
        )}
        <SearchResults results={searchResults} onSelected={onSelected} />
      </div>
    </Form>
  );
}
