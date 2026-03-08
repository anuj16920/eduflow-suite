import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { SearchResultCard } from "./SearchResultCard";
import type { SearchResult } from "./types";

interface Props {
  results: SearchResult[];
  loading: boolean;
  query: string;
  onSelect: (result: SearchResult) => void;
}

export const SearchResultsDropdown = memo(function SearchResultsDropdown({ results, loading, query, onSelect }: Props) {
  if (!query) {
    return (
      <div className="px-4 py-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-3">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">Start typing to search across the platform</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {["Students", "Teachers", "Classes", "Exams"].map((s) => (
            <span key={s} className="px-2.5 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground">{s}</span>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4 py-10 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Searching...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 mb-3">
          <Search className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium">No results found</p>
        <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="max-h-[360px] overflow-y-auto scrollbar-none py-2">
      <AnimatePresence mode="popLayout">
        {results.map((result, i) => (
          <motion.div
            key={result.id + result.type}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ delay: i * 0.03, duration: 0.15 }}
          >
            <SearchResultCard result={result} onSelect={onSelect} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});
