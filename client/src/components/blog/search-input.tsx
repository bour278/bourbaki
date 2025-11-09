import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useSearch } from "@/hooks/use-search";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const { searchQuery, setSearchQuery } = useSearch();

  const handleSearch = (value: string) => {
    setQuery(value);
    // Debounce search
    setTimeout(() => {
      setSearchQuery(value);
    }, 300);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" />
      <Input
        type="search"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 w-64 text-sm border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
      />
    </div>
  );
}
