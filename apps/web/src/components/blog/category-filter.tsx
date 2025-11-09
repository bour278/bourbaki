import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  // categories is a mapping from category name -> post count
  const { data: categories = {} as Record<string, number> } = useQuery<Record<string, number>>({
    queryKey: ['/api/categories'],
  });

  const allCategories = ['all', ...Object.keys(categories)];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {allCategories.map((category) => {
        const isSelected = selectedCategory === category;
        const count = category === 'all' ? null : categories[category];
        
        return (
          <Button
            key={category}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={`rounded-full font-sans text-sm transition-colors ${
              isSelected 
                ? 'bg-primary text-white' 
                : 'text-secondary hover:text-blog-accent border-gray-200'
            }`}
          >
            {category === 'all' ? 'All' : category}
            {count && <span className="ml-1">({count})</span>}
          </Button>
        );
      })}
    </div>
  );
}
