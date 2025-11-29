"use client";

import { useQuery } from "@tanstack/react-query";
import { searchDictionaryByMeaning } from "@/lib/api/dictionary/search-meaning";
import type { DictionaryEntryResponse } from "@/lib/api/types/dictionary";

export function useSearchDictionaryByMeaning(query: string, enabled: boolean) {
  return useQuery<DictionaryEntryResponse[]>({
    queryKey: ["dictionary", "meaning", query],
    queryFn: () => searchDictionaryByMeaning(query),
    enabled: enabled && !!query,
  });
}
