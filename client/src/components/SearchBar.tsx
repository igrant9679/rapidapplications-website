import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useLocation } from "wouter";

interface SearchBarProps {
  variant?: "default" | "compact";
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ 
  variant = "default",
  placeholder = "Search blog posts...",
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(query);
    } else {
      // Navigate to search page with query
      if (query.trim()) {
        setLocation(`/blog?search=${encodeURIComponent(query.trim())}`);
      } else {
        setLocation("/blog");
      }
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    } else {
      setLocation("/blog");
    }
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <Button type="submit">
          Search
        </Button>
      </div>
    </form>
  );
}
