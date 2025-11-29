"use client";

import { useQuery } from "@tanstack/react-query";
import { getPronunciation } from "@/lib/api/dictionary/get-pronunciation";

export function usePronunciation(query: string, enabled: boolean) {
  return useQuery<string>({
    queryKey: ["dictionary", "pronunciation", query],
    queryFn: () => getPronunciation(query),
    enabled: enabled && !!query,
  });
}
