import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  children?: Category[];
}

interface CategoryBreadcrumbsProps {
  postCategories: Category[];
}

/**
 * Flatten hierarchical category tree to flat list
 */
function flattenCategories(categories: Category[]): Category[] {
  const flat: Category[] = [];
  
  function traverse(cats: Category[]) {
    for (const cat of cats) {
      flat.push(cat);
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children);
      }
    }
  }
  
  traverse(categories);
  return flat;
}

/**
 * Build hierarchical breadcrumb path for a category
 * Returns array of categories from root to current
 */
function buildCategoryPath(allCategories: Category[], targetCategory: Category): Category[] {
  const path: Category[] = [];
  let current: Category | undefined = targetCategory;
  
  // Build path from target to root
  while (current) {
    path.unshift(current);
    current = allCategories.find(c => c.id === current!.parentId);
  }
  
  return path;
}

export default function CategoryBreadcrumbs({ postCategories }: CategoryBreadcrumbsProps) {
  const { data: allCategoriesTree } = trpc.blogCategory.list.useQuery();
  
  if (!postCategories || postCategories.length === 0) return null;
  if (!allCategoriesTree) return null;
  
  // Flatten the hierarchical tree to work with it
  const allCategories = flattenCategories(allCategoriesTree);
  
  // For each category assigned to the post, build its full path
  const categoryPaths = postCategories.map(cat => buildCategoryPath(allCategories, cat));
  
  // Display all category paths (in case post belongs to multiple categories)
  return (
    <div className="flex flex-wrap gap-4">
      {categoryPaths.map((path, pathIdx) => (
        <div key={pathIdx} className="flex items-center gap-1 text-sm text-muted-foreground">
          {path.map((category, idx) => (
            <div key={category.id} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="h-4 w-4" />}
              <Link href={`/blog/category/${category.slug}`}>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  {category.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
