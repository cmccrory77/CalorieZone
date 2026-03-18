import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { searchFoods, type FoodItem } from "@/data/foodDatabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Clock, TrendingUp, Minus, Check, X } from "lucide-react";

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
  const [pendingItem, setPendingItem] = useState<DisplayItem | null>(null);
  const [qty, setQty] = useState(1);
  const [qtyText, setQtyText] = useState("1");
  const [multiSelected, setMultiSelected] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const qtyInputRef = useRef<HTMLInputElement>(null);

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

  const isShowingRecents = query.trim().length < 1 && recentItems.length > 0;

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
    setPendingItem(null);
    setMultiSelected(new Set());
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
    setPendingItem(item);
    setQty(1);
    setQtyText("1");
    setShowDropdown(false);
    setTimeout(() => qtyInputRef.current?.select(), 50);
  }, []);

  const toggleMultiSelect = useCallback((idx: number) => {
    setMultiSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const addMultiSelected = useCallback(() => {
    multiSelected.forEach(idx => {
      const item = recentItems[idx];
      if (item) {
        onAdd({
          name: item.name,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
        });
      }
    });
    setMultiSelected(new Set());
    setShowDropdown(false);
  }, [multiSelected, recentItems, onAdd]);

  const confirmAdd = useCallback(() => {
    if (!pendingItem || qty <= 0) return;
    const displayName = pendingItem.isHistory
      ? pendingItem.name
      : `${pendingItem.name}${pendingItem.serving ? ` (${pendingItem.serving})` : ""}`;
    const label = qty !== 1 ? `${displayName} x${qty}` : displayName;
    onAdd({
      name: label,
      calories: Math.round(pendingItem.calories * qty),
      protein: Math.round(pendingItem.protein * qty),
      carbs: Math.round(pendingItem.carbs * qty),
      fat: Math.round(pendingItem.fat * qty),
    });
    setPendingItem(null);
    setQty(1);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, [pendingItem, qty, onAdd]);

  const cancelPending = useCallback(() => {
    setPendingItem(null);
    setQty(1);
    inputRef.current?.focus();
  }, []);

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
    if (pendingItem) return;
    if (query.trim().length >= 1) {
      const merged = mergeResults(query);
      setResults(merged);
      setShowDropdown(merged.length > 0);
    } else if (recentItems.length > 0) {
      setShowDropdown(true);
    }
  }, [query, mergeResults, recentItems, pendingItem]);

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

  const adjustQty = (delta: number) => {
    setQty(prev => {
      const next = Math.round((prev + delta) * 4) / 4;
      const clamped = Math.max(0.25, next);
      setQtyText(String(clamped));
      return clamped;
    });
  };

  const snapQty = () => {
    const v = parseFloat(qtyText);
    if (isNaN(v) || v <= 0) {
      setQty(1);
      setQtyText("1");
    } else {
      const snapped = Math.round(v * 4) / 4;
      const clamped = Math.max(0.25, snapped);
      setQty(clamped);
      setQtyText(String(clamped));
    }
  };

  const multiSelectedCalories = Array.from(multiSelected).reduce((sum, idx) => sum + (recentItems[idx]?.calories ?? 0), 0);

  return (
    <div ref={containerRef} className="space-y-2">
      {pendingItem ? (
        <div className="rounded-xl border border-primary/30 bg-slate-800 dark:bg-slate-800 p-3 space-y-3" data-testid="quantity-selector">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate" data-testid="text-pending-food-name">
                {pendingItem.name}
              </p>
              {pendingItem.serving && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {pendingItem.serving}{pendingItem.unit ? ` · ${pendingItem.unit}` : ""}
                </p>
              )}
            </div>
            <button
              onClick={cancelPending}
              className="p-1 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors shrink-0"
              data-testid="button-cancel-quantity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-700 rounded-lg border border-slate-600 shadow-sm">
              <button
                onClick={() => adjustQty(-0.25)}
                disabled={qty <= 0.25}
                className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 rounded-l-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                data-testid="button-qty-decrease"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <input
                ref={qtyInputRef}
                type="text"
                inputMode="decimal"
                value={qtyText}
                onChange={(e) => {
                  const raw = e.target.value;
                  setQtyText(raw);
                  const v = parseFloat(raw);
                  if (!isNaN(v) && v > 0) setQty(v);
                }}
                onBlur={snapQty}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { snapQty(); confirmAdd(); }
                  if (e.key === "Escape") cancelPending();
                }}
                className="w-14 h-8 text-center text-sm font-bold text-white bg-transparent border-x border-slate-600 focus:outline-none focus:bg-slate-600"
                data-testid="input-quantity"
              />
              <button
                onClick={() => adjustQty(0.25)}
                className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 rounded-r-lg transition-colors"
                data-testid="button-qty-increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <span className="text-xs text-slate-400 whitespace-nowrap">
              {pendingItem.serving ? `× ${pendingItem.serving}` : "serving(s)"}
            </span>

            <div className="flex-1" />

            <div className="text-right">
              <span className="text-lg font-bold text-secondary" data-testid="text-adjusted-calories">
                {Math.round(pendingItem.calories * qty)}
              </span>
              <span className="text-xs text-slate-400 ml-1">kcal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-3 text-[11px] text-slate-400">
              <span>P: <b className="text-blue-400">{Math.round(pendingItem.protein * qty)}g</b></span>
              <span>C: <b className="text-emerald-400">{Math.round(pendingItem.carbs * qty)}g</b></span>
              <span>F: <b className="text-amber-400">{Math.round(pendingItem.fat * qty)}g</b></span>
            </div>
            <div className="flex-1" />
            <Button
              size="sm"
              onClick={confirmAdd}
              className="h-8 px-4 bg-secondary hover:bg-secondary/90 text-white gap-1.5 text-xs font-semibold"
              data-testid="button-confirm-add"
            >
              <Check className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      ) : (
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
                className="pl-8 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm h-9 text-slate-900 dark:text-slate-100"
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
                  className="w-20 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm h-9 text-slate-900 dark:text-slate-100"
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
              className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden max-h-[320px] overflow-y-auto"
            >
              {isShowingRecents && (
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Recent & Frequent</span>
                </div>
              )}
              {displayItems.map((item, idx) => {
                if (isShowingRecents) {
                  const isChecked = multiSelected.has(idx);
                  return (
                    <button
                      key={`${item.name}-${idx}`}
                      data-dropdown-item
                      className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0 ${
                        isChecked ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => toggleMultiSelect(idx)}
                      data-testid={`food-result-${idx}`}
                    >
                      <Checkbox
                        checked={isChecked}
                        className="h-4 w-4 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary pointer-events-none shrink-0"
                        tabIndex={-1}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.frequency && item.frequency > 1 ? (
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                              <TrendingUp className="h-2.5 w-2.5" />
                              {item.frequency}x logged
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-sm font-bold text-secondary">{item.calories}</span>
                        <span className="text-[10px] text-muted-foreground">kcal</span>
                      </div>
                    </button>
                  );
                }

                return (
                  <button
                    key={`${item.name}-${idx}`}
                    data-dropdown-item
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0 ${
                      idx === selectedIndex ? "bg-green-50 dark:bg-green-950/30" : "hover:bg-slate-50 dark:hover:bg-slate-800"
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
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
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
                );
              })}
              {isShowingRecents && multiSelected.size > 0 && (
                <div className="sticky bottom-0 p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {multiSelected.size} selected · <span className="font-semibold text-secondary">{multiSelectedCalories} cal</span>
                  </p>
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-primary hover:bg-primary/90 text-white gap-1"
                    onClick={addMultiSelected}
                    data-testid="button-add-multi-selected"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add {multiSelected.size}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
