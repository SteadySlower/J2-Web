"use client";

import type { DictionaryEntryResponse } from "@/lib/api/types/dictionary";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/frontend/core/components/ui/item";

type SearchResultsProps = {
  results: DictionaryEntryResponse[];
};

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="min-w-md max-w-md overflow-x-auto pb-5">
      <ItemGroup className="flex-row gap-4 flex-nowrap">
        {results.map((result, index) => (
          <Item
            key={index}
            variant="outline"
            size="sm"
            className="min-w-[200px] shrink-0"
          >
            <ItemContent>
              <ItemTitle>
                <div
                  dangerouslySetInnerHTML={{ __html: result.pronunciation }}
                />
              </ItemTitle>
              <ItemDescription>{result.meaning}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
