import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { searchFoods, type FoodItem } from "@/data/foodDatabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Clock, TrendingUp } from "lucide-react";

export interface FrequentFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  frequency: number;
  lastUsed: string;
}

interface FoodSearchProps {
  onAdd: (food: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void;
  frequentFoods?: FrequentFood[];
}

interface DisplayItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category?: string;
  serving?: string;
  unit?: string;
  isHistory?: boolean;
  frequency?: number;
}

export default function FoodSearch({ onAdd, frequentFoods = [] }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DisplayItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [customCalories, setCustomCalories] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const recentItems = useMemo<DisplayItem[]>(() => {
    return frequentFoods.slice(0, 10).map(f => ({
      name: f.name,
      calories: f.calories,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
      isHistory: true,
      frequency: f.frequency,
    }));
  }, [frequentFoods]);

  const mergeResults = useCallback((searchQuery: string): DisplayItem[] => {
    const q = searchQuery.toLowerCase().trim();
    const dbResults = searchFoods(searchQuery);

    const matchingHistory = frequentFoods
      .filter(f => f.name.toLowerCase().includes(q))
      .map(f => ({
        name: f.name,
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
        isHistory: true,
        frequency: f.frequency,
      }));

    const historyNames = new Set(matchingHistory.map(h => h.name.toLowerCase()));
    const dbFiltered: DisplayItem[] = dbResults
      .filter(item => !historyNames.has(`${item.name} (${item.serving})`.toLowerCase()))
      .map(item => ({
        ...item,
        isHistory: false,
      }));

    return [...matchingHistory, ...dbFiltered].slice(0, 15);
  }, [frequentFoods]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length >= 1) {
      const merged = mergeResults(value);
      setResults(merged);
      setShowDropdown(merged.length > 0);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setShowDropdown(isFocused && recentItems.length > 0);
    }
  }, [mergeResults, isFocused, recentItems]);

  const handleSelect = useCallback((item: DisplayItem) => {
    onAdd({
      name: item.isHistory ? item.name : `${item.name}${item.serving ? ` (${item.serving})` : ""}`,
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

  const displayItems = query.trim().length >= 1 ? results : recentItems;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown || displayItems.length === 0) {
      if (e.key === "Enter") handleManualAdd();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => {
        const next = Math.min(prev + 1, displayItems.length - 1);
        scrollToItem(next);
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => {
        const next = Math.max(prev - 1, -1);
        scrollToItem(next);
        return next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < displayItems.length) {
        handleSelect(displayItems[selectedIndex]);
      } else {
        handleManualAdd();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }, [showDropdown, displayItems, selectedIndex, handleSelect, handleManualAdd]);

  const scrollToItem = (index: number) => {
    if (dropdownRef.current && index >= 0) {
      const items = dropdownRef.current.querySelectorAll('[data-dropdown-item]');
      items[index]?.scrollIntoView({ block: "nearest" });
    }
  };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (query.trim().length >= 1) {
      const merged = mergeResults(query);
      setResults(merged);
      setShowDropdown(merged.length > 0);
    } else if (recentItems.length > 0) {
      setShowDropdown(true);
    }
  }, [query, mergeResults, recentItems]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
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

  const showingRecents = query.trim().length < 1 && recentItems.length > 0;

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
              onFocus={handleFocus}
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

        {showDropdown && displayItems.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-[320px] overflow-y-auto"
          >
            {showingRecents && (
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Recent & Frequent</span>
              </div>
            )}
            {displayItems.map((item, idx) => (
              <button
                key={`${item.name}-${idx}`}
                data-dropdown-item
                className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0 ${
                  idx === selectedIndex ? "bg-green-50" : "hover:bg-slate-50"
                }`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                data-testid={`food-result-${idx}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.isHistory && (
                      <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                    )}
                    <span className="text-sm font-medium text-slate-800 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.isHistory && item.frequency && item.frequency > 1 ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 flex items-center gap-0.5">
                        <TrendingUp className="h-2.5 w-2.5" />
                        {item.frequency}x logged
                      </span>
                    ) : item.category ? (
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${categoryColors[item.category] || "bg-slate-100 text-slate-600"}`}>
                        {item.category}
                      </span>
                    ) : null}
                    {item.serving && (
                      <span className="text-xs text-muted-foreground">
                        {item.serving}{item.unit ? ` · ${item.unit}` : ""}
                      </span>
                    )}
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
