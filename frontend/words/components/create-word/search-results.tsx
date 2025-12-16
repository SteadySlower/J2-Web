"use client";

import type { DictionaryEntryResponse } from "@/lib/api/types/dictionary";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/frontend/core/components/ui/item";
import RubyText from "@/frontend/ruby/components/ruby-text";

type SearchResultsProps = {
  results: DictionaryEntryResponse[];
  onSelected: (result: DictionaryEntryResponse) => void;
};

export default function SearchResults({
  results,
  onSelected,
}: SearchResultsProps) {
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
            className="min-w-[200px] shrink-0 cursor-pointer"
            onClick={() => onSelected(result)}
          >
            <ItemContent>
              <ItemTitle>
                <RubyText rubyString={result.pronunciation} />
              </ItemTitle>
              <ItemDescription>{result.meaning}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
