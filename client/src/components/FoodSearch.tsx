import { useState, useRef, useEffect, useCallback } from "react";
import { searchFoods, type FoodItem } from "@/data/foodDatabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface FoodSearchProps {
  onAdd: (food: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void;
}

export default function FoodSearch({ onAdd }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [customCalories, setCustomCalories] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      const matches = searchFoods(value);
      setResults(matches);
      setShowDropdown(matches.length > 0);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, []);

  const handleSelect = useCallback((item: FoodItem) => {
    onAdd({
      name: `${item.name} (${item.serving})`,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
    });
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, [onAdd]);

  const handleManualAdd = useCallback(() => {
    if (query.trim() && customCalories) {
      const cals = parseInt(customCalories);
      if (cals > 0) {
        onAdd({
          name: query.trim(),
          calories: cals,
          protein: Math.round(cals * 0.3 / 4),
          carbs: Math.round(cals * 0.4 / 4),
          fat: Math.round(cals * 0.3 / 9),
        });
        setQuery("");
        setCustomCalories("");
        setShowDropdown(false);
      }
    }
  }, [query, customCalories, onAdd]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) {
      if (e.key === "Enter") handleManualAdd();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else {
        handleManualAdd();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }, [showDropdown, results, selectedIndex, handleSelect, handleManualAdd]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categoryColors: Record<string, string> = {
    protein: "bg-blue-100 text-blue-600",
    grain: "bg-amber-100 text-amber-600",
    fruit: "bg-pink-100 text-pink-600",
    vegetable: "bg-green-100 text-green-600",
    dairy: "bg-sky-100 text-sky-600",
    meal: "bg-orange-100 text-orange-600",
    snack: "bg-violet-100 text-violet-600",
    beverage: "bg-teal-100 text-teal-600",
    dessert: "bg-rose-100 text-rose-600",
    condiment: "bg-slate-100 text-slate-600",
    legume: "bg-lime-100 text-lime-600",
    side: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div ref={containerRef} className="space-y-2">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              placeholder="Search food (e.g. chicken, banana...)"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && results.length > 0 && setShowDropdown(true)}
              className="pl-8 bg-slate-50 border-slate-200 text-sm h-9"
              data-testid="input-food-search"
            />
          </div>
          {query.trim() && (
            <>
              <Input
                type="number"
                placeholder="Kcal"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
                className="w-20 bg-slate-50 border-slate-200 text-sm h-9"
                data-testid="input-custom-calories"
              />
              <Button
                size="icon"
                onClick={handleManualAdd}
                disabled={!customCalories}
                className="h-9 w-9 bg-secondary hover:bg-secondary/90 text-white shrink-0"
                data-testid="button-add-custom-food"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {showDropdown && results.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-[320px] overflow-y-auto">
            {results.map((item, idx) => (
              <button
                key={`${item.name}-${idx}`}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0 ${
                  idx === selectedIndex ? "bg-green-50" : "hover:bg-slate-50"
                }`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                data-testid={`food-result-${idx}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${categoryColors[item.category] || "bg-slate-100 text-slate-600"}`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.serving} · {item.unit}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-sm font-bold text-secondary">{item.calories}</span>
                  <span className="text-[10px] text-muted-foreground">kcal</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
