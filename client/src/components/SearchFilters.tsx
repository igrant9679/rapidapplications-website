import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface SearchFiltersProps {
  authorId?: number;
  categoryId?: number;
  tagId?: number;
  startDate?: string;
  endDate?: string;
  onAuthorChange: (authorId: number | undefined) => void;
  onCategoryChange: (categoryId: number | undefined) => void;
  onTagChange: (tagId: number | undefined) => void;
  onStartDateChange: (date: string | undefined) => void;
  onEndDateChange: (date: string | undefined) => void;
  onClearFilters: () => void;
  authors?: Array<{ id: number; name: string | null }>;
  categories?: Array<{ id: number; name: string }>;
  tags?: Array<{ id: number; name: string }>;
}

export default function SearchFilters({
  authorId,
  categoryId,
  tagId,
  startDate,
  endDate,
  onAuthorChange,
  onCategoryChange,
  onTagChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
  authors = [],
  categories = [],
  tags = [],
}: SearchFiltersProps) {
  const hasActiveFilters =
    authorId !== undefined ||
    categoryId !== undefined ||
    tagId !== undefined ||
    startDate !== undefined ||
    endDate !== undefined;

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Author Filter */}
        <div className="space-y-2">
          <Label htmlFor="author-filter" className="text-xs">
            Author
          </Label>
          <Select
            value={authorId?.toString() || "all"}
            onValueChange={(value) =>
              onAuthorChange(value === "all" ? undefined : parseInt(value))
            }
          >
            <SelectTrigger id="author-filter" className="h-9">
              <SelectValue placeholder="All Authors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              {authors.map((author) => (
                <SelectItem key={author.id} value={author.id.toString()}>
                  {author.name || `User ${author.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category-filter" className="text-xs">
            Category
          </Label>
          <Select
            value={categoryId?.toString() || "all"}
            onValueChange={(value) =>
              onCategoryChange(value === "all" ? undefined : parseInt(value))
            }
          >
            <SelectTrigger id="category-filter" className="h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tag Filter */}
        <div className="space-y-2">
          <Label htmlFor="tag-filter" className="text-xs">
            Tag
          </Label>
          <Select
            value={tagId?.toString() || "all"}
            onValueChange={(value) =>
              onTagChange(value === "all" ? undefined : parseInt(value))
            }
          >
            <SelectTrigger id="tag-filter" className="h-9">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id.toString()}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="start-date-filter" className="text-xs">
            From Date
          </Label>
          <Input
            id="start-date-filter"
            type="date"
            value={startDate || ""}
            onChange={(e) => onStartDateChange(e.target.value || undefined)}
            className="h-9"
          />
        </div>

        {/* End Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="end-date-filter" className="text-xs">
            To Date
          </Label>
          <Input
            id="end-date-filter"
            type="date"
            value={endDate || ""}
            onChange={(e) => onEndDateChange(e.target.value || undefined)}
            className="h-9"
          />
        </div>
      </div>
    </div>
  );
}
