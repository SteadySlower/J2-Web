"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/frontend/core/components/form/input";
import { Button } from "@/frontend/core/components/ui/button";

type FormValues = {
  text: string;
};

function getLanguageFlags(value: string) {
  const isOnlyKorean =
    /^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\p{P}\s]+$/u.test(value);
  const isOnlyJapanese =
    /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\p{P}\s]+$/u.test(value);

  return { isOnlyKorean, isOnlyJapanese };
}

export default function CreateAi() {
  const [value, setValue] = useState("");
  const {
    register,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      text: "",
    },
  });

  const mode: "Korean" | "Japanese" | null = useMemo(() => {
    if (!value) {
      return null;
    }

    const { isOnlyKorean, isOnlyJapanese } = getLanguageFlags(value);

    if (isOnlyKorean) {
      return "Korean";
    }

    if (isOnlyJapanese) {
      return "Japanese";
    }

    return null;
  }, [value]);

  return (
    <div className="flex flex-col gap-4 py-10">
      <Input
        label="일본어, 한국어, 혹은 일본어 발음 (한글로) 검색하세요."
        register={register("text", {
          validate: (v) => {
            const inputValue = v || "";

            if (inputValue.length > 15) {
              return "15자 이하로 입력해주세요.";
            }

            const { isOnlyKorean, isOnlyJapanese } =
              getLanguageFlags(inputValue);

            if (!isOnlyKorean && !isOnlyJapanese && inputValue.length > 0) {
              return "한글 혹은 일본어 중에 한가지만 입력해주세요.";
            }

            return true;
          },
          onChange: (event) => {
            const nextValue = event.target.value;
            setValue(nextValue);
          },
        })}
        error={errors.text}
        placeholder="한글 혹은 일본어를 입력하세요"
      />
      <div className="flex gap-2 justify-end">
        <Button
          variant="default"
          size="sm"
          disabled={mode === null || mode === "Korean"}
        >
          일본어로 검색
        </Button>
        <Button
          variant="default"
          size="sm"
          disabled={mode === null || mode === "Japanese"}
        >
          한국어로 검색
        </Button>
        <Button
          variant="default"
          size="sm"
          disabled={mode === null || mode === "Japanese"}
        >
          발음으로 검색
        </Button>
      </div>
    </div>
  );
}
