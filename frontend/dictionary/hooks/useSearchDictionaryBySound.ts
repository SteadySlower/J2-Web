"use client";

import { useQuery } from "@tanstack/react-query";
import { searchDictionaryBySound } from "@/lib/api/dictionary/search-sound";
import type { DictionaryEntryResponse } from "@/lib/api/types/dictionary";

export function useSearchDictionaryBySound(query: string, enabled: boolean) {
  return useQuery<DictionaryEntryResponse[]>({
    queryKey: ["dictionary", "sound", query],
    queryFn: () => searchDictionaryBySound(query),
    enabled: enabled && !!query,
  });
}
