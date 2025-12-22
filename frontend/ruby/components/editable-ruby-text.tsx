"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from "@/frontend/core/components/ui/tooltip";
import { parseRubyString, segmentsToRubyString } from "../utils";
import type { RubySegment } from "../types";

type EditableRubyTextProps = {
  rubyString: string;
  onRtChange: (newRubyString: string) => void;
};

export default function EditableRubyText({
  rubyString,
  onRtChange,
}: EditableRubyTextProps) {
  const segments = useMemo(() => parseRubyString(rubyString), [rubyString]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempRt, setTempRt] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingIndex]);

  const handleRubyItemClick = (index: number, rt: string) => {
    setEditingIndex(index);
    setTempRt(rt);
  };

  const handleSave = () => {
    if (editingIndex === null) return;

    const newSegments: RubySegment[] = segments.map((segment, index) => {
      if (index === editingIndex && segment.type === "okurigana") {
        return {
          ...segment,
          rt: tempRt,
        };
      }
      return segment;
    });

    const newRubyString = segmentsToRubyString(newSegments);
    onRtChange(newRubyString);
    setEditingIndex(null);
    setTempRt("");
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setTempRt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "{" || e.key === "}") {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value.replace(/[{}]/g, "");
    setTempRt(filteredValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.includes("{") || pastedText.includes("}")) {
      e.preventDefault();
      const filteredText = pastedText.replace(/[{}]/g, "");
      const input = e.currentTarget;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const currentValue = tempRt;
      const newValue =
        currentValue.slice(0, start) + filteredText + currentValue.slice(end);
      setTempRt(newValue);
      setTimeout(() => {
        input.setSelectionRange(
          start + filteredText.length,
          start + filteredText.length
        );
      }, 0);
    }
  };

  return (
    <span className="inline-flex flex-wrap items-end">
      {segments.map((segment, index) => {
        if (segment.type === "okurigana") {
          const isEditing = editingIndex === index;

          if (isEditing) {
            return (
              <span
                key={index}
                className="inline-flex flex-col items-center leading-tight"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={tempRt}
                  onChange={handleChange}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  className="text-[0.5em] leading-none whitespace-nowrap w-16 px-1 py-0.5 border border-primary rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                />
                <span className="whitespace-nowrap">{segment.base}</span>
              </span>
            );
          }

          const rubyItem = (
            <span
              key={index}
              onClick={() => handleRubyItemClick(index, segment.rt)}
              className="inline-flex flex-col items-center leading-tight cursor-pointer hover:bg-muted/50 rounded px-1 transition-colors"
            >
              <span className="text-[0.5em] leading-none whitespace-nowrap">
                {segment.rt}
              </span>
              <span className="whitespace-nowrap">{segment.base}</span>
            </span>
          );

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>{rubyItem}</TooltipTrigger>
              <TooltipContent side="top">
                <p>{`${segment.base} 발음 수정`}</p>
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          );
        }

        return (
          <span key={index} className="inline-block">
            {segment.text}
          </span>
        );
      })}
    </span>
  );
}
