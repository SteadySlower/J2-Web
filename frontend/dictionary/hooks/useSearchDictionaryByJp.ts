"use client";

import { useQuery } from "@tanstack/react-query";
import { searchDictionaryByJp } from "@/lib/api/dictionary/search-jp";
import type { DictionaryEntryResponse } from "@/lib/api/types/dictionary";

export function useSearchDictionaryByJp(query: string, enabled: boolean) {
  return useQuery<DictionaryEntryResponse[]>({
    queryKey: ["dictionary", "jp", query],
    queryFn: () => searchDictionaryByJp(query),
    enabled: enabled && !!query,
  });
}
