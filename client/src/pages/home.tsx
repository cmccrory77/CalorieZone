import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, resolveApiUrl } from "@/lib/queryClient";
import { 
  Activity, 
  Flame, 
  Calendar,
  ChefHat,
  Wand2,
  Plus,
  X,
  PieChart as PieChartIcon,
  Clock,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bookmark,
  Trash2,
  CalendarDays,
  Check,
  Coffee,
  UtensilsCrossed,
  Cookie,
  ShoppingCart,
  Copy,
  Share2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Footprints,
  Home as HomeIcon,
  ScanLine,
  User,
  Moon,
  Sun,
  Pencil
} from "lucide-react";
import { Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { format, addDays, subDays, isToday, isSameDay, startOfWeek, endOfWeek } from "date-fns";
import type { UserProfile, FoodEntry, SavedRecipe, PlannedMeal, ExerciseEntry } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import BarcodeScanner from "@/components/BarcodeScanner";
import MealScanner from "@/components/MealScanner";
import FoodSearch from "@/components/FoodSearch";
import OnboardingDialog from "@/components/OnboardingDialog";
import { isHealthKitAvailable, requestHealthKitPermissions, getTodaySteps, getTodayActiveCalories, writeFoodEntry } from "@/services/healthkit";
import { Heart } from "lucide-react";

import breakfast1 from "@/assets/images/breakfast_meals_1.png";
import breakfast2 from "@/assets/images/breakfast_meals_2.png";
import breakfast3 from "@/assets/images/breakfast_meals_3.png";
import lunch1 from "@/assets/images/lunch_meals_1.png";
import lunch2 from "@/assets/images/lunch_meals_2.png";
import lunch3 from "@/assets/images/lunch_meals_3.png";
import dinner1 from "@/assets/images/dinner_meals_1.png";
import dinner2 from "@/assets/images/dinner_meals_2.png";
import dinner3 from "@/assets/images/dinner_meals_3.png";
import snack1 from "@/assets/images/snack_foods_1.png";
import snack2 from "@/assets/images/snack_foods_2.png";
import snack3 from "@/assets/images/snack_foods_3.png";

export default function Home() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const isViewingToday = isToday(selectedDate);

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  const { data: foodEntries = [] } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries", profile?.id, selectedDateStr],
    enabled: !!profile?.id,
    queryFn: async () => {
      const res = await fetch(resolveApiUrl(`/api/food-entries/${profile!.id}/${selectedDateStr}`));
      if (!res.ok) throw new Error("Failed to load food entries");
      return res.json();
    },
  });

  const { data: frequentFoods = [] } = useQuery<{ name: string; calories: number; protein: number; carbs: number; fat: number; frequency: number; lastUsed: string }[]>({
    queryKey: ["/api/food-entries", profile?.id, "frequent"],
    enabled: !!profile?.id,
    queryFn: async () => {
      const res = await fetch(resolveApiUrl(`/api/food-entries/${profile!.id}/frequent`));
      if (!res.ok) throw new Error("Failed to load frequent foods");
      return res.json();
    },
  });

  const [startingWeight, setStartingWeight] = useState<number | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState(12);
  const [mealType, setMealType] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [generatorIngredients, setGeneratorIngredients] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProteinSource, setGenProteinSource] = useState("chicken");
  const [genMealType, setGenMealType] = useState("dinner");
  const [genServings, setGenServings] = useState(1);

  const { data: savedRecipesData = [] } = useQuery<SavedRecipe[]>({
    queryKey: ["/api/saved-recipes", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const res = await fetch(resolveApiUrl(`/api/saved-recipes/${profile!.id}`));
      if (!res.ok) throw new Error("Failed to load saved recipes");
      return res.json();
    },
  });

  const addSavedRecipeMutation = useMutation({
    mutationFn: async (recipe: any) => {
      const res = await apiRequest("POST", "/api/saved-recipes", {
        profileId: profile!.id,
        title: recipe.title,
        type: recipe.type,
        cuisine: recipe.cuisine || "custom",
        dietaryTag: recipe.dietaryTag || "balanced",
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat,
        time: recipe.time,
        ingredients: recipe.ingredients || [],
        steps: recipe.steps || [],
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-recipes"] });
    },
  });

  const removeSavedRecipeMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/saved-recipes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-recipes"] });
    },
  });

  const [mpBreakfast, setMpBreakfast] = useState(true);
  const [mpLunch, setMpLunch] = useState(true);
  const [mpDinner, setMpDinner] = useState(true);
  const [mpSnacks, setMpSnacks] = useState(true);
  const [mpSnackCount, setMpSnackCount] = useState(1);
  const [mpPreference, setMpPreference] = useState("balanced");
  const [mpIncludeMyRecipes, setMpIncludeMyRecipes] = useState(false);
  const [mpGenerating, setMpGenerating] = useState(false);
  const [groceryListOpen, setGroceryListOpen] = useState(false);
  const [groceryChecked, setGroceryChecked] = useState<Record<string, boolean>>({});
  const [groceryCopied, setGroceryCopied] = useState(false);

  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });
  const weekStartStr = format(currentWeekStart, "yyyy-MM-dd");
  const weekEndStr = format(currentWeekEnd, "yyyy-MM-dd");

  const { data: plannedMealsData = [] } = useQuery<PlannedMeal[]>({
    queryKey: ["/api/planned-meals", profile?.id, weekStartStr, weekEndStr],
    enabled: !!profile?.id,
    queryFn: async () => {
      const res = await fetch(resolveApiUrl(`/api/planned-meals/${profile!.id}/${weekStartStr}/${weekEndStr}`));
      if (!res.ok) throw new Error("Failed to load planned meals");
      return res.json();
    },
  });

  const generateMealPlanMutation = useMutation({
    mutationFn: async (meals: any[]) => {
      const todayStr = format(new Date(), "yyyy-MM-dd");
      await apiRequest("DELETE", `/api/planned-meals/${profile!.id}/${todayStr}/${weekEndStr}`);
      const res = await apiRequest("POST", "/api/planned-meals", { meals });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/planned-meals"] });
    },
  });

  const profileSynced = useRef(false);
  const recipesTabRef = useRef<HTMLDivElement>(null);
  const trackerSectionRef = useRef<HTMLDivElement>(null);
  const recipesSectionRef = useRef<HTMLDivElement>(null);
  const mealPlannerRef = useRef<HTMLDivElement>(null);
  const profileSectionRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [editingWeight, setEditingWeight] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const weightInputRef = useRef<HTMLInputElement>(null);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const goalInputRef = useRef<HTMLInputElement>(null);

  const handleWeightSave = useCallback(() => {
    const newWeight = Number(weightInput);
    if (newWeight > 0 && newWeight !== currentWeight && profile?.id) {
      setCurrentWeight(newWeight);
      updateProfileMutation.mutate({ currentWeight: newWeight } as any);
    }
    setEditingWeight(false);
  }, [weightInput, currentWeight, profile?.id]);

  const handleWeightEdit = useCallback(() => {
    setWeightInput(currentWeight != null ? String(currentWeight) : "");
    setEditingWeight(true);
    setTimeout(() => weightInputRef.current?.select(), 50);
  }, [currentWeight]);

  const handleGoalSave = useCallback(() => {
    const newGoal = Number(goalInput);
    if (newGoal > 0 && newGoal !== targetWeight && profile?.id) {
      setTargetWeight(newGoal);
      updateProfileMutation.mutate({ targetWeight: newGoal } as any);
    }
    setEditingGoal(false);
  }, [goalInput, targetWeight, profile?.id]);

  const handleGoalEdit = useCallback(() => {
    setGoalInput(targetWeight != null ? String(targetWeight) : "");
    setEditingGoal(true);
    setTimeout(() => goalInputRef.current?.select(), 50);
  }, [targetWeight]);
  const [healthKitEnabled, setHealthKitEnabled] = useState(() => localStorage.getItem("caloriezone-healthkit") === "true");
  const [healthKitSteps, setHealthKitSteps] = useState(0);
  const [healthKitCalories, setHealthKitCalories] = useState(0);

  useEffect(() => {
    if (healthKitEnabled && isHealthKitAvailable()) {
      const fetchHealthData = async () => {
        const [steps, calories] = await Promise.all([getTodaySteps(), getTodayActiveCalories()]);
        setHealthKitSteps(steps);
        setHealthKitCalories(calories);
      };
      fetchHealthData();
      const interval = setInterval(fetchHealthData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [healthKitEnabled]);
  const [activeRecipesTab, setActiveRecipesTab] = useState<string | undefined>(undefined);
  const [mobileTab, setMobileTab] = useState<"track" | "plan" | "scan" | "recipes" | "profile">("track");
  const [mealScannerOpen, setMealScannerOpen] = useState(false);
  useEffect(() => {
    if (profile && !profileSynced.current) {
      setStartingWeight(profile.startingWeight);
      setCurrentWeight(profile.currentWeight);
      setTargetWeight(profile.targetWeight);
      setTimeframe(profile.timeframe);
      profileSynced.current = true;
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const res = await apiRequest("PATCH", `/api/profile/${profile!.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
  });

  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const handleOnboardingComplete = useCallback((data: {
    name: string;
    avatarSeed: string;
    startingWeight: number;
    currentWeight: number;
    targetWeight: number;
    timeframe: number;
    activityLevel: string;
    targetDate: string;
  }) => {
    if (!profile?.id) return;
    updateProfileMutation.mutate({
      name: data.name,
      avatarSeed: data.avatarSeed,
      startingWeight: data.startingWeight,
      currentWeight: data.currentWeight,
      targetWeight: data.targetWeight,
      timeframe: data.timeframe,
      activityLevel: data.activityLevel,
      targetDate: data.targetDate,
    } as any);
    setStartingWeight(data.startingWeight);
    setCurrentWeight(data.currentWeight);
    setTargetWeight(data.targetWeight);
    setTimeframe(data.timeframe);
    setEditProfileOpen(false);
  }, [profile?.id]);

  const handleMobileTab = useCallback((tab: "track" | "plan" | "scan" | "recipes" | "profile") => {
    setMobileTab(tab);
    if (tab === "track") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab === "plan") {
      mealPlannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tab === "scan") {
      setMealScannerOpen(true);
    } else if (tab === "recipes") {
      setActiveRecipesTab("recommended");
      setTimeout(() => {
        const el = recipesTabRef.current;
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
    } else if (tab === "profile") {
      setTimeout(() => {
        profileSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, []);

  const addFoodMutation = useMutation({
    mutationFn: async (entry: { name: string; calories: number; protein: number; carbs: number; fat: number }) => {
      const res = await apiRequest("POST", "/api/food-entries", {
        profileId: profile!.id,
        date: selectedDateStr,
        ...entry,
      });
      if (healthKitEnabled && isHealthKitAvailable()) {
        writeFoodEntry(entry.calories, entry.protein, entry.carbs, entry.fat).catch(() => {});
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries/range"] });
    },
  });

  const removeFoodMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/food-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries/range"] });
    },
  });

  const trackedFoods = foodEntries;

  const { data: exerciseEntries = [] } = useQuery<ExerciseEntry[]>({
    queryKey: ["/api/exercise-entries", profile?.id, selectedDateStr],
    enabled: !!profile?.id,
    queryFn: async () => {
      const res = await fetch(resolveApiUrl(`/api/exercise-entries/${profile!.id}/${selectedDateStr}`));
      if (!res.ok) throw new Error("Failed to load exercise entries");
      return res.json();
    },
  });

  const addExerciseMutation = useMutation({
    mutationFn: async (entry: { name: string; duration: number; caloriesBurned: number }) => {
      const res = await apiRequest("POST", "/api/exercise-entries", {
        profileId: profile!.id,
        name: entry.name,
        duration: entry.duration,
        caloriesBurned: entry.caloriesBurned,
        date: selectedDateStr,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exercise-entries"] });
    },
  });

  const removeExerciseMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/exercise-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exercise-entries"] });
    },
  });

  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<{ name: string; calPerMin: number } | null>(null);
  const [exerciseDuration, setExerciseDuration] = useState(30);

  const commonExercises = [
    { name: "Walking", calPerMin: 5 },
    { name: "Running", calPerMin: 12 },
    { name: "Cycling", calPerMin: 10 },
    { name: "Swimming", calPerMin: 11 },
    { name: "Weight Training", calPerMin: 8 },
    { name: "Yoga", calPerMin: 4 },
    { name: "HIIT", calPerMin: 14 },
    { name: "Jump Rope", calPerMin: 13 },
    { name: "Dancing", calPerMin: 7 },
    { name: "Hiking", calPerMin: 7 },
    { name: "Rowing", calPerMin: 10 },
    { name: "Stair Climbing", calPerMin: 9 },
    { name: "Elliptical", calPerMin: 8 },
    { name: "Pilates", calPerMin: 5 },
    { name: "Tennis", calPerMin: 9 },
    { name: "Basketball", calPerMin: 10 },
  ];

  const filteredExercises = exerciseSearch.trim()
    ? commonExercises.filter(e => e.name.toLowerCase().includes(exerciseSearch.toLowerCase()))
    : commonExercises;

  const totalExerciseCaloriesBurned = exerciseEntries.reduce((acc, e) => acc + e.caloriesBurned, 0);
  const exerciseCaloriesBonus = Math.round(totalExerciseCaloriesBurned * 0.5);

  const handleRemoveFood = (id: string) => {
    removeFoodMutation.mutate(id);
  };
  
  const addRecipeToTracker = (recipe: any) => {
    addFoodMutation.mutate({
      name: recipe.title,
      calories: recipe.calories,
      protein: parseInt(recipe.protein),
      carbs: parseInt(recipe.carbs),
      fat: parseInt(recipe.fat),
    });
  };

  const { toast } = useToast();
  const [selectedMealIds, setSelectedMealIds] = useState<Record<string, Set<string>>>({});
  const [loggingDay, setLoggingDay] = useState<string | null>(null);
  const [showPastDays, setShowPastDays] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddSelected, setQuickAddSelected] = useState<Set<number>>(new Set());

  const { data: weekFoodEntries = [] } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries/range", profile?.id, weekStartStr, weekEndStr],
    enabled: !!profile?.id && plannedMealsData.length > 0,
    queryFn: async () => {
      const res = await fetch(resolveApiUrl(`/api/food-entries/${profile!.id}/range/${weekStartStr}/${weekEndStr}`));
      if (!res.ok) throw new Error("Failed to load week food entries");
      return res.json();
    },
  });

  const loggedMealIds = useMemo(() => {
    const logged = new Set<string>();
    for (const meal of plannedMealsData) {
      const matchingEntry = weekFoodEntries.find(
        e => e.name === meal.title && e.date === meal.date
      );
      if (matchingEntry) {
        logged.add(meal.id);
      }
    }
    return logged;
  }, [plannedMealsData, weekFoodEntries]);

  const toggleMealSelection = (dateStr: string, mealId: string) => {
    setSelectedMealIds(prev => {
      const daySet = new Set(prev[dateStr] || []);
      if (daySet.has(mealId)) {
        daySet.delete(mealId);
      } else {
        daySet.add(mealId);
      }
      return { ...prev, [dateStr]: daySet };
    });
  };

  const toggleAllMealsForDay = (dateStr: string, meals: PlannedMeal[]) => {
    setSelectedMealIds(prev => {
      const daySet = new Set(prev[dateStr] || []);
      const unloggedMeals = meals.filter(m => !loggedMealIds.has(m.id));
      const allSelected = unloggedMeals.every(m => daySet.has(m.id));
      if (allSelected) {
        unloggedMeals.forEach(m => daySet.delete(m.id));
      } else {
        unloggedMeals.forEach(m => daySet.add(m.id));
      }
      return { ...prev, [dateStr]: daySet };
    });
  };

  const handleLogSelectedMeals = async (dateStr: string, allMeals: PlannedMeal[]) => {
    const selected = selectedMealIds[dateStr];
    if (!profile?.id || !selected || selected.size === 0) return;
    const mealsToLog = allMeals.filter(m => selected.has(m.id));
    if (mealsToLog.length === 0) return;

    setLoggingDay(dateStr);
    try {
      for (const meal of mealsToLog) {
        await apiRequest("POST", "/api/food-entries", {
          profileId: profile.id,
          date: dateStr,
          name: meal.title,
          calories: meal.calories,
          protein: parseInt(String(meal.protein)),
          carbs: parseInt(String(meal.carbs)),
          fat: parseInt(String(meal.fat)),
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries/range"] });
      setSelectedMealIds(prev => ({ ...prev, [dateStr]: new Set() }));
      const dayLabel = format(new Date(dateStr + "T12:00:00"), "EEEE, MMM d");
      toast({
        title: `${mealsToLog.length} meal${mealsToLog.length > 1 ? 's' : ''} logged`,
        description: `Added to your food diary for ${dayLabel}`,
      });
    } catch (e) {
      console.error("Failed to log meals", e);
      toast({
        title: "Failed to log meals",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoggingDay(null);
    }
  };


  const maintenanceCalories = profile?.maintenanceCalories ?? 2450;
  const sw = startingWeight ?? 0;
  const cw = currentWeight ?? 0;
  const tw = targetWeight ?? 0;
  const isGainingWeight = tw > sw;
  const weeklyLossGoal = Math.abs(cw - tw) / timeframe;
  const dailyDifference = weeklyLossGoal * 500;
  
  const targetCalories = isGainingWeight 
    ? Math.round(maintenanceCalories + dailyDifference)
    : Math.round(maintenanceCalories - dailyDifference);
  
  const totalWeightDifference = Math.abs(sw - tw);
  const weightChangedSoFar = Math.abs(sw - cw);
  const progressPercentage = totalWeightDifference > 0 
    ? Math.max(0, Math.min(100, (weightChangedSoFar / totalWeightDifference) * 100)) 
    : 0;

  // Macro Calculations
  const totalProtein = trackedFoods.reduce((acc, food) => acc + (food.protein || 0), 0);
  const totalCarbs = trackedFoods.reduce((acc, food) => acc + (food.carbs || 0), 0);
  const totalFat = trackedFoods.reduce((acc, food) => acc + (food.fat || 0), 0);
  
  const targetProtein = Math.round((targetCalories * 0.3) / 4);
  const targetCarbs = Math.round((targetCalories * 0.4) / 4);
  const targetFat = Math.round((targetCalories * 0.3) / 9);

  const getDailyRecipes = () => {
    const dayOfWeek = new Date().getDay(); // 0 to 6
    const cuisines = ["all", "vegetarian", "italian", "mediterranean", "asian", "mexican", "american"];
    const categories = ["breakfast", "lunch", "dinner", "snack"];
    const imagesByCategory: Record<string, string[]> = {
      breakfast: [breakfast1, breakfast2, breakfast3],
      lunch: [lunch1, lunch2, lunch3],
      dinner: [dinner1, dinner2, dinner3],
      snack: [snack1, snack2, snack3],
    };
    
    const cuisineKeywords: Record<string, string[]> = {
      italian: ["Tuscan", "Garlic", "Basil", "Tomato", "Parmesan", "Herb", "Roasted", "Rustic"],
      asian: ["Ginger", "Soy", "Teriyaki", "Sesame", "Spicy", "Miso", "Sriracha", "Glazed"],
      mexican: ["Spicy", "Avocado", "Cilantro", "Jalapeno", "Salsa", "Chipotle", "Lime", "Baja"],
      vegetarian: ["Plant-based", "Green", "Roasted", "Fresh", "Harvest", "Wholesome", "Garden", "Nutrient"],
      mediterranean: ["Olive", "Feta", "Lemon", "Herb", "Greek", "Zesty", "Sun-dried", "Aegean"],
      american: ["Classic", "BBQ", "Grilled", "Homestyle", "Smoked", "Maple", "Hearty", "Savory"],
      all: ["Healthy", "Fresh", "Balanced", "Nourishing", "Lean", "Power", "Protein", "Vitality"]
    };

    const mealNouns: Record<string, string[]> = {
      breakfast: ["Oatmeal", "Scramble", "Pancakes"],
      lunch: ["Wrap", "Salad", "Bowl"],
      dinner: ["Skillet", "Roast", "Stir-fry"],
      snack: ["Bites", "Dip", "Mix"]
    };

    const proteins = ["Chicken", "Tofu", "Salmon", "Turkey", "Beef", "Chickpeas", "Egg", "Tempeh", "Black Beans", "Lentils"];

    const ingredientTemplates: Record<string, Record<string, { item: string; amount: string; cal: number }[]>> = {
      breakfast: {
        Oatmeal: [
          { item: "Rolled oats", amount: "½ cup (40g)", cal: 150 },
          { item: "Milk or water", amount: "1 cup", cal: 50 },
          { item: "Fresh mixed berries", amount: "½ cup (75g)", cal: 35 },
          { item: "Honey", amount: "1 tsp", cal: 20 },
          { item: "Chopped almonds", amount: "1 tbsp (10g)", cal: 55 },
          { item: "Pinch of cinnamon", amount: "⅛ tsp", cal: 0 }
        ],
        Scramble: [
          { item: "Large eggs", amount: "3", cal: 210 },
          { item: "Milk", amount: "1 tbsp", cal: 10 },
          { item: "Butter or olive oil", amount: "1 tsp", cal: 35 },
          { item: "Fresh herbs (chives, parsley)", amount: "1 tbsp", cal: 2 },
          { item: "Whole-grain toast", amount: "1 slice", cal: 80 },
          { item: "Salt and pepper", amount: "To taste", cal: 0 }
        ],
        Pancakes: [
          { item: "All-purpose flour", amount: "½ cup (60g)", cal: 220 },
          { item: "Egg", amount: "1", cal: 70 },
          { item: "Milk", amount: "⅓ cup", cal: 35 },
          { item: "Melted butter", amount: "1 tbsp", cal: 100 },
          { item: "Baking powder", amount: "½ tsp", cal: 0 },
          { item: "Fresh fruit topping", amount: "¼ cup", cal: 25 },
          { item: "Maple syrup", amount: "1 tbsp", cal: 50 }
        ]
      },
      lunch: {
        Wrap: [
          { item: "Large flour tortilla", amount: "1 (10-inch)", cal: 180 },
          { item: "Sliced protein", amount: "3 oz (85g)", cal: 120 },
          { item: "Romaine lettuce", amount: "1 cup, shredded", cal: 8 },
          { item: "Tomato", amount: "¼ cup, diced", cal: 8 },
          { item: "Hummus or spread", amount: "2 tbsp", cal: 50 },
          { item: "Red onion", amount: "2 tbsp, sliced", cal: 5 },
          { item: "Olive oil drizzle", amount: "1 tsp", cal: 40 }
        ],
        Salad: [
          { item: "Mixed greens", amount: "3 cups", cal: 20 },
          { item: "Grilled protein", amount: "4 oz (115g)", cal: 150 },
          { item: "Cherry tomatoes", amount: "½ cup, halved", cal: 15 },
          { item: "Cucumber", amount: "½ cup, sliced", cal: 8 },
          { item: "Avocado", amount: "¼ medium", cal: 60 },
          { item: "Quinoa or grains", amount: "¼ cup, cooked", cal: 55 },
          { item: "Olive oil & lemon dressing", amount: "1 tbsp", cal: 70 }
        ],
        Bowl: [
          { item: "Cooked quinoa or rice", amount: "½ cup (95g)", cal: 110 },
          { item: "Seasoned protein", amount: "4 oz (115g)", cal: 150 },
          { item: "Roasted vegetables", amount: "1 cup", cal: 60 },
          { item: "Pickled onion or radish", amount: "2 tbsp", cal: 5 },
          { item: "Tahini or sauce", amount: "1 tbsp", cal: 45 },
          { item: "Olive oil", amount: "1 tsp", cal: 40 },
          { item: "Sesame seeds", amount: "1 tsp", cal: 15 }
        ]
      },
      dinner: {
        Skillet: [
          { item: "Protein of choice", amount: "5 oz (140g)", cal: 200 },
          { item: "Mixed bell peppers", amount: "1 cup, diced", cal: 30 },
          { item: "Onion", amount: "½ medium, diced", cal: 22 },
          { item: "Garlic", amount: "2 cloves, minced", cal: 8 },
          { item: "Olive oil", amount: "1 tbsp", cal: 120 },
          { item: "Seasoning & spices", amount: "1 tsp blend", cal: 5 },
          { item: "Fresh herbs for garnish", amount: "1 tbsp", cal: 2 }
        ],
        Roast: [
          { item: "Protein of choice", amount: "5 oz (140g)", cal: 200 },
          { item: "Baby potatoes or sweet potato", amount: "½ cup (75g)", cal: 65 },
          { item: "Broccoli or asparagus", amount: "1 cup", cal: 30 },
          { item: "Olive oil", amount: "1 tbsp", cal: 120 },
          { item: "Garlic", amount: "2 cloves", cal: 8 },
          { item: "Fresh rosemary & thyme", amount: "1 sprig each", cal: 2 },
          { item: "Salt and pepper", amount: "To taste", cal: 0 }
        ],
        "Stir-fry": [
          { item: "Protein of choice, sliced thin", amount: "4 oz (115g)", cal: 160 },
          { item: "Broccoli florets", amount: "½ cup", cal: 15 },
          { item: "Bell pepper", amount: "½ cup, sliced", cal: 15 },
          { item: "Snap peas or green beans", amount: "½ cup", cal: 20 },
          { item: "Soy sauce", amount: "1 tbsp", cal: 10 },
          { item: "Sesame oil", amount: "1 tsp", cal: 40 },
          { item: "Cooked rice or noodles", amount: "½ cup", cal: 100 },
          { item: "Ginger & garlic", amount: "1 tsp each, minced", cal: 10 }
        ]
      },
      snack: {
        Bites: [
          { item: "Rolled oats", amount: "¼ cup (20g)", cal: 75 },
          { item: "Peanut or almond butter", amount: "1 tbsp", cal: 95 },
          { item: "Honey", amount: "1 tsp", cal: 20 },
          { item: "Mini chocolate chips", amount: "1 tsp", cal: 25 },
          { item: "Chia or flax seeds", amount: "1 tsp", cal: 15 }
        ],
        Dip: [
          { item: "Chickpeas (canned, drained)", amount: "½ cup (120g)", cal: 110 },
          { item: "Tahini", amount: "1 tbsp", cal: 45 },
          { item: "Lemon juice", amount: "1 tbsp", cal: 4 },
          { item: "Garlic", amount: "1 clove", cal: 4 },
          { item: "Olive oil", amount: "1 tsp", cal: 40 },
          { item: "Carrot & celery sticks", amount: "1 cup", cal: 35 }
        ],
        Mix: [
          { item: "Raw almonds", amount: "2 tbsp (15g)", cal: 85 },
          { item: "Cashews", amount: "1 tbsp (10g)", cal: 55 },
          { item: "Dried cranberries", amount: "1 tbsp", cal: 30 },
          { item: "Pumpkin seeds", amount: "1 tbsp", cal: 45 },
          { item: "Dark chocolate chips", amount: "1 tsp", cal: 25 }
        ]
      }
    };

    const stepTemplates: Record<string, Record<string, string[][]>> = {
      breakfast: {
        Oatmeal: [
          ["Bring 1 cup of water or milk to a boil in a small saucepan."],
          ["Stir in ½ cup rolled oats and reduce heat to medium-low."],
          ["Cook for 4-5 minutes, stirring occasionally, until creamy."],
          ["Top with fresh berries, a drizzle of honey, and a sprinkle of nuts."],
          ["Serve warm and enjoy."]
        ],
        Scramble: [
          ["Crack 2-3 eggs into a bowl, add a splash of milk, and whisk until smooth."],
          ["Heat a non-stick pan over medium heat and add a pat of butter or oil."],
          ["Pour in the egg mixture and gently stir with a spatula as it sets."],
          ["Season with salt, pepper, and fresh herbs when nearly done."],
          ["Plate alongside whole-grain toast and serve immediately."]
        ],
        Pancakes: [
          ["Mix 1 cup flour, 1 tbsp sugar, 1 tsp baking powder, and a pinch of salt in a bowl."],
          ["In a separate bowl, whisk together 1 egg, ¾ cup milk, and 2 tbsp melted butter."],
          ["Combine wet and dry ingredients and stir until just combined (a few lumps are fine)."],
          ["Pour ¼ cup batter per pancake onto a heated, greased griddle or skillet."],
          ["Flip when bubbles form on the surface, cook until golden, and serve with fresh fruit."]
        ]
      },
      lunch: {
        Wrap: [
          ["Warm a large tortilla or flatbread in a dry skillet for 30 seconds per side."],
          ["Spread a thin layer of your preferred sauce or hummus across the center."],
          ["Layer sliced protein, crisp lettuce, tomato, and any desired toppings."],
          ["Fold in the sides and roll tightly from the bottom up."],
          ["Slice in half diagonally and serve with a side salad."]
        ],
        Salad: [
          ["Wash and chop a generous portion of mixed greens and place in a large bowl."],
          ["Prepare and slice your protein, grains, and any fresh vegetables."],
          ["Arrange the toppings over the greens in sections for a composed look."],
          ["Whisk together olive oil, lemon juice, salt, and pepper for a simple dressing."],
          ["Drizzle the dressing over the salad, toss gently, and serve."]
        ],
        Bowl: [
          ["Cook your base grain (quinoa, rice, or farro) according to package directions."],
          ["Season and cook your protein in a skillet over medium-high heat until done."],
          ["Roast or sauté a mix of seasonal vegetables with olive oil and seasoning."],
          ["Assemble the bowl: grain base, protein, veggies, and any pickled or fresh toppings."],
          ["Finish with a drizzle of tahini or your favorite sauce and serve."]
        ]
      },
      dinner: {
        Skillet: [
          ["Season your protein generously with salt, pepper, and your chosen spices."],
          ["Heat oil in a large skillet over medium-high heat until shimmering."],
          ["Sear the protein for 3-4 minutes per side until golden, then set aside to rest."],
          ["In the same skillet, sauté diced vegetables until tender, about 5-6 minutes."],
          ["Return the protein to the skillet, add any sauce, and simmer for 2-3 minutes to combine."]
        ],
        Roast: [
          ["Preheat your oven to 400°F (200°C) and line a baking sheet with parchment paper."],
          ["Season the protein with herbs, garlic, olive oil, salt, and pepper."],
          ["Arrange the protein in the center and surround with chopped vegetables."],
          ["Roast for 25-35 minutes until the protein is cooked through and veggies are caramelized."],
          ["Let rest for 5 minutes, then plate and serve with your choice of side."]
        ],
        "Stir-fry": [
          ["Prep all ingredients: slice protein thinly and chop vegetables into bite-sized pieces."],
          ["Heat a wok or large skillet over high heat and add a tablespoon of oil."],
          ["Cook the protein first for 2-3 minutes until just done, then remove and set aside."],
          ["Stir-fry the vegetables in batches, starting with the firmest ones, for 3-4 minutes total."],
          ["Return the protein, pour in your sauce, toss everything together, and serve over rice or noodles."]
        ]
      },
      snack: {
        Bites: [
          ["Combine oats, nut butter, honey, and mix-ins (seeds, chocolate chips) in a bowl."],
          ["Stir until the mixture holds together when pressed."],
          ["Roll into 1-inch balls using slightly damp hands."],
          ["Place on a parchment-lined tray and refrigerate for at least 30 minutes."],
          ["Store in an airtight container in the fridge for up to a week."]
        ],
        Dip: [
          ["Drain and rinse your base ingredient (chickpeas, beans, or vegetables)."],
          ["Add to a food processor along with tahini, lemon juice, garlic, and olive oil."],
          ["Blend until smooth, scraping down the sides as needed, and season to taste."],
          ["Transfer to a serving bowl and drizzle with olive oil and a sprinkle of paprika."],
          ["Serve with fresh-cut veggies, pita chips, or crackers."]
        ],
        Mix: [
          ["Select your base of nuts and seeds (almonds, cashews, pumpkin seeds)."],
          ["Add dried fruits like cranberries, apricots, or raisins for sweetness."],
          ["Toss in a handful of dark chocolate chips or coconut flakes if desired."],
          ["Mix everything together in a bowl and season lightly with sea salt."],
          ["Portion into small bags or containers for easy grab-and-go snacking."]
        ]
      }
    };
    
    const generatedRecipes: any[] = [];
    let idCounter = 1;

    cuisines.forEach((c) => {
      const keywords = cuisineKeywords[c] || cuisineKeywords.all;
      categories.forEach((cat) => {
        const nouns = mealNouns[cat];
        const catImages = imagesByCategory[cat];
        
        for (let i = 0; i < 3; i++) {
          let strHash = 0;
          const comboStr = c + cat;
          for(let k=0; k<comboStr.length; k++) {
            strHash = ((strHash << 5) - strHash) + comboStr.charCodeAt(k);
            strHash |= 0;
          }
          
          const seed = Math.abs(dayOfWeek * 10000 + strHash * 10 + i);
          
          const keyword = keywords[seed % keywords.length];
          const protein = proteins[(seed * 3) % proteins.length];
          const noun = nouns[i];
          
          let title = `${keyword} ${protein} ${noun}`;
          if (cat === 'snack') {
            title = i === 0 ? `${keyword} Energy ${noun}` : i === 1 ? `${keyword} Hummus & ${noun}` : `${keyword} Trail ${noun}`;
          } else if (cat === 'breakfast') {
            title = i === 0 ? `${keyword} ${noun} with Berries` : i === 1 ? `${protein} & ${keyword} ${noun}` : `${keyword} ${protein} ${noun}`;
          }

          const proteinLower = protein.toLowerCase();
          const substituteProtein = (text: string) =>
            text
              .replace(/\bProtein of choice,?\s*/gi, protein + ' ')
              .replace(/\bSeasoned protein\b/gi, `Seasoned ${proteinLower}`)
              .replace(/\bGrilled protein\b/gi, `Grilled ${proteinLower}`)
              .replace(/\bSliced protein\b/gi, `Sliced ${proteinLower}`)
              .replace(/\byour protein\b/gi, proteinLower)
              .replace(/\bthe protein\b/gi, `the ${proteinLower}`)
              .replace(/\bprotein\b/g, proteinLower);

          const steps = (stepTemplates[cat]?.[noun] || []).map(s => substituteProtein(s[0]));
          const baseIngredients = ingredientTemplates[cat]?.[noun] || [];
          const recipeCals = 200 + ((seed * 7) % 300) + (cat === 'snack' ? -100 : 100);
          const baseCals = baseIngredients.reduce((sum, ing) => sum + ing.cal, 0);
          const scale = baseCals > 0 ? recipeCals / baseCals : 1;
          const ingredients = baseIngredients.map(ing => ({
            item: substituteProtein(ing.item),
            amount: ing.amount,
            cal: Math.round(ing.cal * scale)
          }));

          generatedRecipes.push({
            id: idCounter++,
            title,
            type: cat,
            cuisine: c,
            calories: 200 + ((seed * 7) % 300) + (cat === 'snack' ? -100 : 100),
            protein: `${10 + ((seed * 11) % 35)}g`,
            carbs: `${20 + ((seed * 13) % 40)}g`,
            fat: `${5 + ((seed * 17) % 20)}g`,
            time: `${5 + ((seed * 19) % 6) * 5} min`,
            image: catImages[i],
            match: `${85 + ((seed * 23) % 15)}% Match`,
            ingredients,
            steps
          });
        }
      });
    });

    return generatedRecipes;
  };

  const handleGenerateWeekPlan = () => {
    if (!profile?.id) return;
    setMpGenerating(true);

    const mealTypes: string[] = [];
    if (mpBreakfast) mealTypes.push("breakfast");
    if (mpLunch) mealTypes.push("lunch");
    if (mpDinner) mealTypes.push("dinner");
    if (mpSnacks) for (let s = 0; s < mpSnackCount; s++) mealTypes.push("snack");

    if (mealTypes.length === 0) { setMpGenerating(false); return; }

    const mealWeights: Record<string, number> = { breakfast: 25, lunch: 30, dinner: 35, snack: 10 };
    const totalWeight = mealTypes.reduce((sum, mt) => sum + (mealWeights[mt] || 10), 0);
    const calPerMealType: Record<string, number> = {};
    mealTypes.forEach(mt => {
      calPerMealType[mt] = Math.round((mealWeights[mt] || 10) / totalWeight * targetCalories);
    });

    const macroRatios: Record<string, { p: number; c: number; f: number }> = {
      balanced: { p: 0.3, c: 0.4, f: 0.3 },
      "high-protein": { p: 0.4, c: 0.3, f: 0.3 },
      keto: { p: 0.3, c: 0.1, f: 0.6 },
      vegetarian: { p: 0.25, c: 0.45, f: 0.3 },
    };
    const ratios = macroRatios[mpPreference] || macroRatios.balanced;

    type MealTemplate = { title: string; ingredients: { item: string; amount: string; cal: number }[]; steps: string[] };
    const mealTemplates: Record<string, MealTemplate[]> = {
      breakfast: [
        { title: "Power Oatmeal Bowl", ingredients: [{ item: "Rolled oats", amount: "1/2 cup", cal: 150 }, { item: "Protein powder", amount: "1 scoop", cal: 120 }, { item: "Banana", amount: "1/2 medium", cal: 53 }, { item: "Almond butter", amount: "1 tbsp", cal: 98 }, { item: "Blueberries", amount: "1/4 cup", cal: 21 }, { item: "Chia seeds", amount: "1 tsp", cal: 17 }], steps: ["Bring 1 cup of water to a boil, stir in oats and reduce heat to medium-low.", "Cook oats for 5 minutes, stirring occasionally until creamy.", "Remove from heat and stir in protein powder until fully combined.", "Top with sliced banana, blueberries, a drizzle of almond butter, and chia seeds."] },
        { title: "Protein Scramble", ingredients: [{ item: "Eggs", amount: "3 large", cal: 210 }, { item: "Bell pepper", amount: "1/2 cup diced", cal: 15 }, { item: "Spinach", amount: "1 cup", cal: 7 }, { item: "Turkey sausage", amount: "2 oz", cal: 90 }, { item: "Olive oil", amount: "1 tsp", cal: 40 }, { item: "Feta cheese", amount: "1 tbsp", cal: 25 }], steps: ["Heat olive oil in a non-stick skillet over medium heat.", "Crumble turkey sausage into the pan and cook for 3 minutes until browned.", "Add diced bell pepper and cook 2 minutes until slightly softened.", "Pour in beaten eggs and scramble gently, folding in spinach until wilted.", "Top with crumbled feta and serve immediately."] },
        { title: "Greek Yogurt Parfait", ingredients: [{ item: "Greek yogurt", amount: "1 cup", cal: 130 }, { item: "Granola", amount: "1/4 cup", cal: 120 }, { item: "Mixed berries", amount: "1/2 cup", cal: 40 }, { item: "Honey", amount: "1 tsp", cal: 21 }, { item: "Sliced almonds", amount: "1 tbsp", cal: 35 }], steps: ["Spoon half the Greek yogurt into a glass or bowl.", "Layer half the granola and half the mixed berries on top.", "Add the remaining yogurt, then top with remaining granola and berries.", "Drizzle with honey and sprinkle sliced almonds on top."] },
        { title: "Berry Smoothie Bowl", ingredients: [{ item: "Frozen mixed berries", amount: "1 cup", cal: 70 }, { item: "Banana", amount: "1/2 frozen", cal: 53 }, { item: "Protein powder", amount: "1 scoop", cal: 120 }, { item: "Almond milk", amount: "1/2 cup", cal: 15 }, { item: "Granola", amount: "2 tbsp", cal: 60 }, { item: "Coconut flakes", amount: "1 tbsp", cal: 35 }], steps: ["Blend frozen berries, banana, protein powder, and almond milk until thick and smooth.", "Pour into a bowl — the consistency should be thicker than a regular smoothie.", "Top with granola, coconut flakes, and any extra fresh berries.", "Serve immediately before it melts."] },
        { title: "Avocado Toast Plate", ingredients: [{ item: "Whole grain bread", amount: "2 slices", cal: 160 }, { item: "Avocado", amount: "1/2 medium", cal: 120 }, { item: "Eggs", amount: "2 large", cal: 140 }, { item: "Cherry tomatoes", amount: "4 halved", cal: 12 }, { item: "Red pepper flakes", amount: "pinch", cal: 0 }, { item: "Lemon juice", amount: "1 tsp", cal: 1 }], steps: ["Toast the bread slices until golden and firm.", "Mash avocado with lemon juice, salt, and pepper in a small bowl.", "Poach or fry the eggs to your preference.", "Spread mashed avocado on toast, top each with an egg, tomatoes, and red pepper flakes."] },
        { title: "Banana Pancakes", ingredients: [{ item: "Banana", amount: "1 large ripe", cal: 105 }, { item: "Eggs", amount: "2 large", cal: 140 }, { item: "Oat flour", amount: "1/4 cup", cal: 110 }, { item: "Protein powder", amount: "1/2 scoop", cal: 60 }, { item: "Maple syrup", amount: "1 tbsp", cal: 52 }, { item: "Cooking spray", amount: "1 spray", cal: 5 }], steps: ["Mash banana in a bowl, then whisk in eggs until combined.", "Add oat flour and protein powder, stirring until a smooth batter forms.", "Heat a non-stick pan over medium heat and spray lightly.", "Pour 1/4 cup batter per pancake, cook 2-3 minutes per side until golden.", "Stack pancakes and drizzle with maple syrup."] },
        { title: "Egg Muffin Cups", ingredients: [{ item: "Eggs", amount: "4 large", cal: 280 }, { item: "Turkey bacon", amount: "2 slices diced", cal: 70 }, { item: "Cheddar cheese", amount: "2 tbsp shredded", cal: 56 }, { item: "Spinach", amount: "1/2 cup chopped", cal: 4 }, { item: "Bell pepper", amount: "1/4 cup diced", cal: 8 }, { item: "Salt & pepper", amount: "to taste", cal: 0 }], steps: ["Preheat oven to 375°F and grease a muffin tin.", "Whisk eggs in a bowl with salt and pepper.", "Divide turkey bacon, spinach, and bell pepper evenly among 4 muffin cups.", "Pour egg mixture over the fillings, filling each cup about 3/4 full.", "Sprinkle cheese on top and bake for 18-20 minutes until set and golden."] },
      ],
      lunch: [
        { title: "Grilled Chicken Salad", ingredients: [{ item: "Chicken breast", amount: "5 oz", cal: 165 }, { item: "Mixed greens", amount: "3 cups", cal: 15 }, { item: "Cherry tomatoes", amount: "1/2 cup", cal: 15 }, { item: "Cucumber", amount: "1/2 cup sliced", cal: 8 }, { item: "Olive oil dressing", amount: "2 tbsp", cal: 120 }, { item: "Croutons", amount: "2 tbsp", cal: 30 }], steps: ["Season chicken breast with salt, pepper, and garlic powder.", "Grill over medium-high heat for 5-6 minutes per side until cooked through.", "Let chicken rest for 3 minutes, then slice into strips.", "Toss mixed greens, tomatoes, and cucumber in a bowl with dressing.", "Top with sliced chicken and croutons."] },
        { title: "Quinoa Power Bowl", ingredients: [{ item: "Quinoa", amount: "1/2 cup cooked", cal: 111 }, { item: "Grilled chicken", amount: "4 oz", cal: 130 }, { item: "Black beans", amount: "1/4 cup", cal: 57 }, { item: "Avocado", amount: "1/4 medium", cal: 60 }, { item: "Corn kernels", amount: "2 tbsp", cal: 18 }, { item: "Lime dressing", amount: "1 tbsp", cal: 45 }], steps: ["Cook quinoa according to package directions and fluff with a fork.", "Warm black beans and corn in a small pan.", "Slice grilled chicken and avocado.", "Layer quinoa in a bowl, top with chicken, beans, corn, and avocado.", "Drizzle with lime dressing and serve."] },
        { title: "Turkey Avocado Wrap", ingredients: [{ item: "Whole wheat tortilla", amount: "1 large", cal: 130 }, { item: "Sliced turkey", amount: "4 oz", cal: 120 }, { item: "Avocado", amount: "1/4 medium", cal: 60 }, { item: "Lettuce", amount: "2 leaves", cal: 5 }, { item: "Tomato", amount: "3 slices", cal: 6 }, { item: "Mustard", amount: "1 tbsp", cal: 10 }], steps: ["Warm the tortilla in a dry skillet for 30 seconds per side.", "Spread mustard across the center of the tortilla.", "Layer turkey slices, lettuce, tomato slices, and sliced avocado.", "Fold in the sides, then roll tightly from the bottom up.", "Slice in half diagonally and serve."] },
        { title: "Mediterranean Bowl", ingredients: [{ item: "Brown rice", amount: "1/2 cup cooked", cal: 108 }, { item: "Grilled chicken", amount: "4 oz", cal: 130 }, { item: "Hummus", amount: "2 tbsp", cal: 70 }, { item: "Cucumber", amount: "1/4 cup diced", cal: 4 }, { item: "Feta cheese", amount: "1 tbsp", cal: 25 }, { item: "Kalamata olives", amount: "4 pitted", cal: 24 }], steps: ["Place cooked brown rice as the base of your bowl.", "Arrange sliced grilled chicken on one side.", "Add a generous dollop of hummus, diced cucumber, and olives.", "Sprinkle crumbled feta over the top.", "Drizzle with a little olive oil if desired and serve."] },
        { title: "Asian Noodle Bowl", ingredients: [{ item: "Soba noodles", amount: "3 oz dry", cal: 150 }, { item: "Shrimp", amount: "4 oz", cal: 100 }, { item: "Edamame", amount: "1/4 cup", cal: 47 }, { item: "Carrot", amount: "1/4 cup shredded", cal: 11 }, { item: "Soy-ginger sauce", amount: "2 tbsp", cal: 40 }, { item: "Sesame seeds", amount: "1 tsp", cal: 18 }], steps: ["Cook soba noodles according to package directions, drain and rinse under cold water.", "Sauté shrimp in a hot skillet for 2 minutes per side until pink.", "Toss noodles with soy-ginger sauce in a large bowl.", "Top with cooked shrimp, edamame, and shredded carrot.", "Garnish with sesame seeds and serve warm or cold."] },
        { title: "Southwest Burrito Bowl", ingredients: [{ item: "Cilantro lime rice", amount: "1/2 cup", cal: 115 }, { item: "Ground turkey", amount: "4 oz", cal: 150 }, { item: "Black beans", amount: "1/4 cup", cal: 57 }, { item: "Salsa", amount: "3 tbsp", cal: 15 }, { item: "Sour cream", amount: "1 tbsp", cal: 30 }, { item: "Shredded cheese", amount: "1 tbsp", cal: 28 }], steps: ["Season ground turkey with cumin, chili powder, and garlic, cook until browned.", "Place rice in a bowl as the base layer.", "Top with seasoned turkey, black beans, and salsa.", "Add a dollop of sour cream and sprinkle with shredded cheese.", "Garnish with fresh cilantro if desired."] },
        { title: "Harvest Grain Bowl", ingredients: [{ item: "Farro", amount: "1/2 cup cooked", cal: 100 }, { item: "Roasted sweet potato", amount: "1/2 cup cubed", cal: 90 }, { item: "Grilled chicken", amount: "3 oz", cal: 100 }, { item: "Kale", amount: "1 cup", cal: 33 }, { item: "Dried cranberries", amount: "1 tbsp", cal: 26 }, { item: "Balsamic vinaigrette", amount: "1 tbsp", cal: 40 }], steps: ["Cook farro according to package directions until tender.", "Massage kale with a pinch of salt until slightly wilted.", "Layer farro, kale, and roasted sweet potato in a bowl.", "Top with sliced grilled chicken and dried cranberries.", "Drizzle balsamic vinaigrette over the top and toss gently."] },
      ],
      dinner: [
        { title: "Herb Roasted Chicken", ingredients: [{ item: "Chicken thighs", amount: "6 oz", cal: 210 }, { item: "Baby potatoes", amount: "4 oz halved", cal: 90 }, { item: "Green beans", amount: "1 cup", cal: 31 }, { item: "Olive oil", amount: "1 tbsp", cal: 120 }, { item: "Fresh rosemary", amount: "1 sprig", cal: 1 }, { item: "Garlic cloves", amount: "3 minced", cal: 12 }], steps: ["Preheat oven to 400°F.", "Toss chicken thighs with olive oil, rosemary, garlic, salt, and pepper.", "Arrange potatoes and green beans around the chicken on a sheet pan.", "Roast for 30-35 minutes until chicken reaches 165°F and potatoes are tender.", "Let rest 5 minutes before serving."] },
        { title: "Salmon with Vegetables", ingredients: [{ item: "Salmon fillet", amount: "5 oz", cal: 250 }, { item: "Asparagus", amount: "6 spears", cal: 20 }, { item: "Lemon", amount: "1/2 sliced", cal: 9 }, { item: "Olive oil", amount: "1 tsp", cal: 40 }, { item: "Brown rice", amount: "1/3 cup cooked", cal: 72 }, { item: "Dill", amount: "1 tsp fresh", cal: 0 }], steps: ["Preheat oven to 400°F and line a baking sheet with parchment.", "Place salmon on the sheet, drizzle with olive oil, and season with salt, pepper, and dill.", "Arrange asparagus around the salmon and lay lemon slices on top.", "Bake for 14-16 minutes until salmon flakes easily with a fork.", "Serve over brown rice with a squeeze of fresh lemon."] },
        { title: "Lean Beef Stir-fry", ingredients: [{ item: "Lean beef strips", amount: "5 oz", cal: 200 }, { item: "Broccoli", amount: "1 cup florets", cal: 31 }, { item: "Bell pepper", amount: "1/2 sliced", cal: 15 }, { item: "Soy sauce", amount: "2 tbsp", cal: 18 }, { item: "Sesame oil", amount: "1 tsp", cal: 40 }, { item: "Brown rice", amount: "1/3 cup cooked", cal: 72 }], steps: ["Slice beef into thin strips and marinate in soy sauce for 10 minutes.", "Heat sesame oil in a wok or large skillet over high heat.", "Stir-fry beef strips for 2-3 minutes until browned, then remove from pan.", "Add broccoli and bell pepper, stir-fry 3-4 minutes until crisp-tender.", "Return beef to the pan, toss to combine, and serve over brown rice."] },
        { title: "Lemon Garlic Shrimp", ingredients: [{ item: "Large shrimp", amount: "6 oz peeled", cal: 150 }, { item: "Zucchini noodles", amount: "2 cups", cal: 40 }, { item: "Garlic", amount: "3 cloves minced", cal: 12 }, { item: "Lemon juice", amount: "2 tbsp", cal: 6 }, { item: "Butter", amount: "1 tbsp", cal: 100 }, { item: "Parsley", amount: "1 tbsp chopped", cal: 1 }], steps: ["Melt butter in a large skillet over medium-high heat.", "Add minced garlic and cook 30 seconds until fragrant.", "Add shrimp in a single layer and cook 2 minutes per side until pink.", "Squeeze lemon juice over the shrimp and toss with parsley.", "Serve immediately over zucchini noodles."] },
        { title: "Baked Cod & Greens", ingredients: [{ item: "Cod fillet", amount: "6 oz", cal: 140 }, { item: "Spinach", amount: "2 cups", cal: 14 }, { item: "Cherry tomatoes", amount: "1/2 cup", cal: 15 }, { item: "Olive oil", amount: "1 tbsp", cal: 120 }, { item: "Breadcrumbs", amount: "2 tbsp", cal: 56 }, { item: "Lemon zest", amount: "1 tsp", cal: 1 }], steps: ["Preheat oven to 375°F.", "Place cod on a lined baking sheet, drizzle with half the olive oil.", "Mix breadcrumbs with lemon zest and press onto the top of the cod.", "Bake for 15-18 minutes until fish flakes easily.", "Sauté spinach and tomatoes in remaining olive oil for 2 minutes and serve alongside."] },
        { title: "Turkey Meatball Skillet", ingredients: [{ item: "Ground turkey", amount: "5 oz", cal: 190 }, { item: "Marinara sauce", amount: "1/2 cup", cal: 60 }, { item: "Whole wheat pasta", amount: "2 oz dry", cal: 180 }, { item: "Parmesan cheese", amount: "1 tbsp grated", cal: 22 }, { item: "Italian seasoning", amount: "1 tsp", cal: 3 }, { item: "Garlic powder", amount: "1/2 tsp", cal: 5 }], steps: ["Mix ground turkey with Italian seasoning, garlic powder, and a pinch of salt.", "Form into 5-6 small meatballs.", "Brown meatballs in a skillet over medium heat for 4 minutes, turning occasionally.", "Pour marinara sauce over meatballs, cover, and simmer 10 minutes.", "Cook pasta according to package directions, drain, and serve topped with meatballs and Parmesan."] },
        { title: "Chickpea Curry Bowl", ingredients: [{ item: "Chickpeas", amount: "1/2 cup", cal: 134 }, { item: "Coconut milk", amount: "1/4 cup", cal: 60 }, { item: "Curry paste", amount: "1 tbsp", cal: 20 }, { item: "Spinach", amount: "1 cup", cal: 7 }, { item: "Brown rice", amount: "1/3 cup cooked", cal: 72 }, { item: "Onion", amount: "1/4 diced", cal: 11 }], steps: ["Sauté diced onion in a pot over medium heat until softened, about 3 minutes.", "Stir in curry paste and cook 1 minute until fragrant.", "Add chickpeas and coconut milk, simmer for 8-10 minutes.", "Stir in spinach and cook until wilted, about 1 minute.", "Serve over brown rice."] },
      ],
      snack: [
        { title: "Apple & Almond Butter", ingredients: [{ item: "Apple", amount: "1 medium", cal: 95 }, { item: "Almond butter", amount: "1.5 tbsp", cal: 147 }], steps: ["Wash and slice the apple into wedges, removing the core.", "Spread almond butter on a small plate for dipping.", "Enjoy apple slices dipped in almond butter."] },
        { title: "Greek Yogurt & Berries", ingredients: [{ item: "Greek yogurt", amount: "3/4 cup", cal: 100 }, { item: "Mixed berries", amount: "1/3 cup", cal: 27 }, { item: "Honey", amount: "1/2 tsp", cal: 11 }], steps: ["Scoop Greek yogurt into a small bowl.", "Top with mixed berries and a drizzle of honey.", "Stir gently if desired and enjoy."] },
        { title: "Trail Mix Cup", ingredients: [{ item: "Almonds", amount: "10 pieces", cal: 70 }, { item: "Dark chocolate chips", amount: "1 tbsp", cal: 70 }, { item: "Dried cranberries", amount: "1 tbsp", cal: 26 }, { item: "Pumpkin seeds", amount: "1 tbsp", cal: 47 }], steps: ["Measure out each ingredient into a small bowl or cup.", "Toss gently to combine.", "Enjoy as a grab-and-go snack."] },
        { title: "Hummus & Veggie Sticks", ingredients: [{ item: "Hummus", amount: "3 tbsp", cal: 105 }, { item: "Carrot sticks", amount: "1/2 cup", cal: 25 }, { item: "Celery sticks", amount: "1/2 cup", cal: 8 }, { item: "Bell pepper strips", amount: "1/4 cup", cal: 8 }], steps: ["Scoop hummus into a small dish or ramekin.", "Wash and cut carrots, celery, and bell pepper into sticks.", "Arrange around the hummus and dip to enjoy."] },
        { title: "Protein Energy Bites", ingredients: [{ item: "Oats", amount: "1/4 cup", cal: 75 }, { item: "Peanut butter", amount: "1 tbsp", cal: 94 }, { item: "Honey", amount: "1 tsp", cal: 21 }, { item: "Protein powder", amount: "1/2 scoop", cal: 60 }, { item: "Mini chocolate chips", amount: "1 tsp", cal: 20 }], steps: ["Combine oats, peanut butter, honey, and protein powder in a bowl.", "Mix until a sticky dough forms, fold in chocolate chips.", "Roll into 3-4 small balls and place on parchment.", "Refrigerate for 15 minutes to firm up before eating."] },
        { title: "Cottage Cheese Bowl", ingredients: [{ item: "Cottage cheese", amount: "1/2 cup", cal: 110 }, { item: "Pineapple chunks", amount: "1/4 cup", cal: 21 }, { item: "Walnuts", amount: "1 tbsp chopped", cal: 48 }], steps: ["Scoop cottage cheese into a small bowl.", "Top with pineapple chunks and chopped walnuts.", "Season with a pinch of cinnamon if desired."] },
        { title: "Rice Cake & PB", ingredients: [{ item: "Rice cakes", amount: "2 plain", cal: 70 }, { item: "Peanut butter", amount: "1 tbsp", cal: 94 }, { item: "Banana", amount: "1/4 sliced", cal: 26 }], steps: ["Spread peanut butter evenly over each rice cake.", "Top with banana slices.", "Enjoy immediately."] },
      ],
    };

    const vegetarianOverrides: Partial<Record<string, MealTemplate[]>> = {
      lunch: [
        { title: "Lentil Soup Bowl", ingredients: [{ item: "Red lentils", amount: "1/2 cup dry", cal: 170 }, { item: "Carrots", amount: "1/2 cup diced", cal: 25 }, { item: "Celery", amount: "1/4 cup diced", cal: 4 }, { item: "Vegetable broth", amount: "1 cup", cal: 15 }, { item: "Olive oil", amount: "1 tsp", cal: 40 }, { item: "Cumin", amount: "1 tsp", cal: 8 }], steps: ["Heat olive oil in a pot, sauté diced carrots and celery for 3 minutes.", "Add cumin and cook 30 seconds until fragrant.", "Stir in lentils and broth, bring to a boil.", "Reduce heat and simmer 20 minutes until lentils are tender.", "Season with salt and pepper, serve with crusty bread."] },
        { title: "Falafel Wrap", ingredients: [{ item: "Falafel patties", amount: "3 pieces", cal: 180 }, { item: "Whole wheat pita", amount: "1 large", cal: 130 }, { item: "Tahini sauce", amount: "1 tbsp", cal: 45 }, { item: "Lettuce", amount: "1/2 cup shredded", cal: 5 }, { item: "Tomato", amount: "3 slices", cal: 6 }, { item: "Pickled onion", amount: "2 tbsp", cal: 5 }], steps: ["Warm falafel patties in the oven at 375°F for 8 minutes.", "Warm pita briefly in a dry skillet.", "Spread tahini sauce across the pita.", "Layer lettuce, tomato, pickled onion, and falafel.", "Fold and wrap tightly."] },
        { title: "Caprese Quinoa Bowl", ingredients: [{ item: "Quinoa", amount: "1/2 cup cooked", cal: 111 }, { item: "Fresh mozzarella", amount: "2 oz", cal: 140 }, { item: "Cherry tomatoes", amount: "1/2 cup", cal: 15 }, { item: "Fresh basil", amount: "4 leaves", cal: 1 }, { item: "Balsamic glaze", amount: "1 tbsp", cal: 30 }, { item: "Olive oil", amount: "1 tsp", cal: 40 }], steps: ["Place cooked quinoa in a bowl as the base.", "Slice mozzarella and halve cherry tomatoes.", "Arrange on top of quinoa with fresh basil leaves.", "Drizzle with olive oil and balsamic glaze."] },
        { title: "Black Bean Burrito", ingredients: [{ item: "Black beans", amount: "1/2 cup", cal: 114 }, { item: "Tortilla", amount: "1 large", cal: 130 }, { item: "Brown rice", amount: "1/4 cup cooked", cal: 54 }, { item: "Salsa", amount: "2 tbsp", cal: 10 }, { item: "Avocado", amount: "1/4 medium", cal: 60 }, { item: "Shredded cheese", amount: "1 tbsp", cal: 28 }], steps: ["Warm black beans in a small pot with cumin and garlic powder.", "Heat tortilla in a dry skillet until pliable.", "Layer rice, beans, salsa, avocado, and cheese down the center.", "Fold in sides and roll tightly.", "Optional: toast seam-side down in skillet for a crispy exterior."] },
        { title: "Tofu Stir-fry Bowl", ingredients: [{ item: "Firm tofu", amount: "5 oz pressed", cal: 120 }, { item: "Broccoli", amount: "1 cup", cal: 31 }, { item: "Soy sauce", amount: "2 tbsp", cal: 18 }, { item: "Sesame oil", amount: "1 tsp", cal: 40 }, { item: "Brown rice", amount: "1/3 cup cooked", cal: 72 }, { item: "Ginger", amount: "1 tsp grated", cal: 2 }], steps: ["Press tofu for 10 minutes, then cube into 1/2-inch pieces.", "Heat sesame oil in a wok over high heat.", "Add tofu cubes and cook until golden on all sides, about 5 minutes.", "Add broccoli and ginger, stir-fry 3 minutes.", "Add soy sauce, toss, and serve over brown rice."] },
        { title: "Veggie Pad Thai", ingredients: [{ item: "Rice noodles", amount: "2 oz dry", cal: 200 }, { item: "Tofu", amount: "3 oz", cal: 70 }, { item: "Bean sprouts", amount: "1/2 cup", cal: 13 }, { item: "Peanuts", amount: "1 tbsp crushed", cal: 50 }, { item: "Pad Thai sauce", amount: "2 tbsp", cal: 50 }, { item: "Lime", amount: "1 wedge", cal: 2 }], steps: ["Soak rice noodles in hot water for 8 minutes, then drain.", "Pan-fry cubed tofu until golden brown.", "Toss noodles with pad Thai sauce in the same pan.", "Add bean sprouts and toss for 1 minute.", "Serve topped with crushed peanuts and a lime wedge."] },
        { title: "Mushroom Risotto Bowl", ingredients: [{ item: "Arborio rice", amount: "1/3 cup dry", cal: 160 }, { item: "Mushrooms", amount: "1 cup sliced", cal: 15 }, { item: "Vegetable broth", amount: "1 cup", cal: 15 }, { item: "Parmesan", amount: "1 tbsp grated", cal: 22 }, { item: "Butter", amount: "1 tsp", cal: 34 }, { item: "Thyme", amount: "1 tsp fresh", cal: 1 }], steps: ["Sauté mushrooms in butter until golden, about 4 minutes.", "Add rice and toast for 1 minute, stirring constantly.", "Add broth 1/4 cup at a time, stirring until absorbed before adding more.", "Continue until rice is creamy and tender, about 18 minutes.", "Stir in Parmesan and thyme, serve immediately."] },
      ],
      dinner: [
        { title: "Chickpea Curry Bowl", ingredients: [{ item: "Chickpeas", amount: "1/2 cup", cal: 134 }, { item: "Coconut milk", amount: "1/4 cup", cal: 60 }, { item: "Curry paste", amount: "1 tbsp", cal: 20 }, { item: "Spinach", amount: "1 cup", cal: 7 }, { item: "Brown rice", amount: "1/3 cup cooked", cal: 72 }, { item: "Onion", amount: "1/4 diced", cal: 11 }], steps: ["Sauté diced onion until softened, about 3 minutes.", "Stir in curry paste and cook 1 minute.", "Add chickpeas and coconut milk, simmer 10 minutes.", "Stir in spinach until wilted.", "Serve over brown rice."] },
        { title: "Stuffed Bell Peppers", ingredients: [{ item: "Bell peppers", amount: "2 large", cal: 50 }, { item: "Quinoa", amount: "1/2 cup cooked", cal: 111 }, { item: "Black beans", amount: "1/4 cup", cal: 57 }, { item: "Corn", amount: "2 tbsp", cal: 18 }, { item: "Tomato sauce", amount: "1/4 cup", cal: 20 }, { item: "Cheese", amount: "2 tbsp shredded", cal: 56 }], steps: ["Preheat oven to 375°F.", "Slice tops off peppers and remove seeds.", "Mix quinoa, black beans, corn, and tomato sauce.", "Stuff peppers with the mixture and top with cheese.", "Bake 25-30 minutes until peppers are tender."] },
        { title: "Eggplant Parmesan", ingredients: [{ item: "Eggplant", amount: "1 medium sliced", cal: 82 }, { item: "Marinara sauce", amount: "1/2 cup", cal: 60 }, { item: "Mozzarella", amount: "2 oz", cal: 140 }, { item: "Breadcrumbs", amount: "3 tbsp", cal: 84 }, { item: "Egg", amount: "1 beaten", cal: 70 }, { item: "Parmesan", amount: "1 tbsp", cal: 22 }], steps: ["Slice eggplant into 1/2-inch rounds and salt for 15 minutes.", "Dip slices in beaten egg, then coat with breadcrumbs.", "Bake at 400°F for 15 minutes per side until crispy.", "Layer in a baking dish with marinara and mozzarella.", "Broil 3-4 minutes until cheese is bubbly and golden."] },
        { title: "Lentil Bolognese", ingredients: [{ item: "Green lentils", amount: "1/2 cup cooked", cal: 115 }, { item: "Whole wheat pasta", amount: "2 oz dry", cal: 180 }, { item: "Marinara sauce", amount: "1/2 cup", cal: 60 }, { item: "Carrot", amount: "1/4 cup diced", cal: 13 }, { item: "Garlic", amount: "2 cloves minced", cal: 8 }, { item: "Olive oil", amount: "1 tsp", cal: 40 }], steps: ["Cook pasta according to package directions.", "Sauté garlic and diced carrot in olive oil for 3 minutes.", "Add lentils and marinara sauce, simmer 10 minutes.", "Toss with cooked pasta.", "Serve with a sprinkle of nutritional yeast if desired."] },
        { title: "Vegetable Stir-fry", ingredients: [{ item: "Tofu", amount: "4 oz", cal: 96 }, { item: "Mixed vegetables", amount: "2 cups", cal: 60 }, { item: "Teriyaki sauce", amount: "2 tbsp", cal: 30 }, { item: "Sesame oil", amount: "1 tsp", cal: 40 }, { item: "Brown rice", amount: "1/3 cup cooked", cal: 72 }, { item: "Sesame seeds", amount: "1 tsp", cal: 18 }], steps: ["Press and cube tofu, pan-fry until golden.", "Heat sesame oil in a wok over high heat.", "Stir-fry mixed vegetables for 3-4 minutes until crisp-tender.", "Add tofu and teriyaki sauce, toss to coat.", "Serve over brown rice with sesame seeds."] },
        { title: "Sweet Potato Black Bean", ingredients: [{ item: "Sweet potato", amount: "1 medium", cal: 103 }, { item: "Black beans", amount: "1/2 cup", cal: 114 }, { item: "Avocado", amount: "1/4 medium", cal: 60 }, { item: "Lime juice", amount: "1 tbsp", cal: 4 }, { item: "Cumin", amount: "1/2 tsp", cal: 4 }, { item: "Greek yogurt", amount: "2 tbsp", cal: 18 }], steps: ["Preheat oven to 400°F, pierce sweet potato with a fork.", "Bake 45-50 minutes until tender.", "Warm black beans with cumin and a pinch of chili powder.", "Split sweet potato and stuff with seasoned beans.", "Top with avocado, Greek yogurt, and a squeeze of lime."] },
        { title: "Mushroom Stroganoff", ingredients: [{ item: "Mushrooms", amount: "2 cups sliced", cal: 30 }, { item: "Egg noodles", amount: "2 oz dry", cal: 180 }, { item: "Greek yogurt", amount: "3 tbsp", cal: 30 }, { item: "Onion", amount: "1/4 diced", cal: 11 }, { item: "Garlic", amount: "2 cloves", cal: 8 }, { item: "Olive oil", amount: "1 tsp", cal: 40 }], steps: ["Cook egg noodles according to package directions.", "Sauté onion and garlic in olive oil until softened.", "Add mushrooms and cook until they release liquid and brown, about 6 minutes.", "Stir in Greek yogurt and a splash of vegetable broth.", "Toss with cooked noodles and serve."] },
      ],
    };

    const ketoOverrides: Partial<Record<string, MealTemplate[]>> = {
      breakfast: [
        { title: "Bacon & Egg Plate", ingredients: [{ item: "Eggs", amount: "3 large", cal: 210 }, { item: "Bacon", amount: "3 slices", cal: 129 }, { item: "Avocado", amount: "1/2 medium", cal: 120 }, { item: "Cherry tomatoes", amount: "4 halved", cal: 12 }], steps: ["Cook bacon in a skillet until crispy, set aside on paper towel.", "Fry eggs in bacon drippings to your liking.", "Slice avocado and halve tomatoes.", "Plate everything together and season with salt and pepper."] },
        { title: "Keto Avocado Bowl", ingredients: [{ item: "Avocado", amount: "1 whole", cal: 240 }, { item: "Egg", amount: "1 large", cal: 70 }, { item: "Everything seasoning", amount: "1 tsp", cal: 5 }, { item: "Olive oil", amount: "1 tsp", cal: 40 }], steps: ["Halve avocado and remove the pit.", "Crack an egg into one half (scoop out a bit of flesh to fit).", "Bake at 400°F for 12-15 minutes until egg is set.", "Sprinkle with everything seasoning and serve."] },
        { title: "Cheese Omelette", ingredients: [{ item: "Eggs", amount: "3 large", cal: 210 }, { item: "Cheddar cheese", amount: "1 oz", cal: 113 }, { item: "Butter", amount: "1 tbsp", cal: 100 }, { item: "Chives", amount: "1 tbsp chopped", cal: 1 }], steps: ["Beat eggs with a pinch of salt.", "Melt butter in a non-stick pan over medium-low heat.", "Pour in eggs and cook gently, lifting edges to let uncooked egg flow under.", "When almost set, add cheese to one half and fold over.", "Slide onto plate and garnish with chives."] },
        { title: "Sausage & Spinach", ingredients: [{ item: "Pork sausage", amount: "3 oz", cal: 230 }, { item: "Spinach", amount: "2 cups", cal: 14 }, { item: "Eggs", amount: "2 large", cal: 140 }, { item: "Olive oil", amount: "1 tsp", cal: 40 }], steps: ["Brown sausage in a skillet, breaking into pieces.", "Add spinach and cook until wilted.", "Push to the side, add olive oil and scramble eggs.", "Combine everything and serve."] },
        { title: "Cream Cheese Pancakes", ingredients: [{ item: "Cream cheese", amount: "2 oz", cal: 200 }, { item: "Eggs", amount: "2 large", cal: 140 }, { item: "Cinnamon", amount: "1/2 tsp", cal: 3 }, { item: "Butter", amount: "1 tsp", cal: 34 }], steps: ["Blend cream cheese, eggs, and cinnamon until smooth.", "Melt butter in a non-stick pan over medium heat.", "Pour small rounds of batter and cook 2 minutes per side.", "Serve warm — these are thin like crepes."] },
        { title: "Bulletproof Smoothie", ingredients: [{ item: "Coffee", amount: "1 cup brewed", cal: 2 }, { item: "MCT oil", amount: "1 tbsp", cal: 130 }, { item: "Butter", amount: "1 tbsp", cal: 100 }, { item: "Collagen powder", amount: "1 scoop", cal: 70 }], steps: ["Brew coffee and pour while hot into a blender.", "Add MCT oil, butter, and collagen powder.", "Blend on high for 20 seconds until frothy and creamy.", "Pour into a mug and enjoy."] },
        { title: "Ham & Cheese Roll-ups", ingredients: [{ item: "Deli ham", amount: "4 slices", cal: 120 }, { item: "Swiss cheese", amount: "2 slices", cal: 160 }, { item: "Cream cheese", amount: "1 oz", cal: 100 }, { item: "Pickle", amount: "1 spear", cal: 5 }], steps: ["Lay ham slices flat on a cutting board.", "Spread cream cheese thinly over each slice.", "Place a strip of Swiss cheese and pickle spear on each.", "Roll up tightly and secure with a toothpick if needed."] },
      ],
      snack: [
        { title: "Cheese & Nuts", ingredients: [{ item: "Cheddar cheese", amount: "1 oz cubed", cal: 113 }, { item: "Macadamia nuts", amount: "1 oz", cal: 204 }], steps: ["Cut cheese into bite-sized cubes.", "Pair with macadamia nuts for a satisfying high-fat snack."] },
        { title: "Celery & Cream Cheese", ingredients: [{ item: "Celery stalks", amount: "3 large", cal: 20 }, { item: "Cream cheese", amount: "2 tbsp", cal: 100 }, { item: "Everything seasoning", amount: "1/2 tsp", cal: 3 }], steps: ["Wash and trim celery stalks.", "Fill the groove with cream cheese.", "Sprinkle with everything seasoning."] },
        { title: "Beef Jerky", ingredients: [{ item: "Beef jerky", amount: "1 oz", cal: 80 }, { item: "String cheese", amount: "1 stick", cal: 80 }], steps: ["Pair beef jerky with a string cheese for a portable keto snack."] },
        { title: "Avocado Halves", ingredients: [{ item: "Avocado", amount: "1/2 medium", cal: 120 }, { item: "Everything seasoning", amount: "1 tsp", cal: 5 }, { item: "Lime juice", amount: "1 tsp", cal: 1 }], steps: ["Halve the avocado and remove the pit.", "Squeeze lime juice over the flesh.", "Sprinkle with everything seasoning and eat with a spoon."] },
        { title: "Pork Rind Nachos", ingredients: [{ item: "Pork rinds", amount: "1 oz", cal: 160 }, { item: "Shredded cheese", amount: "1 oz", cal: 110 }, { item: "Jalapeño", amount: "3 slices", cal: 2 }], steps: ["Spread pork rinds on an oven-safe plate.", "Top with shredded cheese and jalapeño slices.", "Broil for 2-3 minutes until cheese is melted."] },
        { title: "Fat Bombs", ingredients: [{ item: "Coconut oil", amount: "1 tbsp", cal: 120 }, { item: "Cocoa powder", amount: "1 tsp", cal: 10 }, { item: "Peanut butter", amount: "1 tbsp", cal: 94 }, { item: "Stevia", amount: "2 drops", cal: 0 }], steps: ["Melt coconut oil and mix with cocoa powder, peanut butter, and stevia.", "Pour into silicone molds.", "Freeze for 30 minutes until solid."] },
        { title: "Olives & Almonds", ingredients: [{ item: "Kalamata olives", amount: "8 pitted", cal: 48 }, { item: "Almonds", amount: "15 pieces", cal: 105 }], steps: ["Combine olives and almonds in a small bowl.", "Enjoy as a savory low-carb snack."] },
      ],
    };

    const currentTemplates: Record<string, MealTemplate[]> = { ...mealTemplates };
    if (mpPreference === "vegetarian") {
      Object.assign(currentTemplates, vegetarianOverrides);
    }
    if (mpPreference === "keto") {
      Object.assign(currentTemplates, ketoOverrides);
    }

    const compatibleRecipes = savedRecipesData.filter(r => {
      const tag = (r as any).dietaryTag || "balanced";
      if (mpPreference === "vegetarian") return tag === "vegetarian";
      if (mpPreference === "balanced") return true;
      if (mpPreference === "high-protein") return tag !== "vegetarian" || tag === "high-protein";
      if (mpPreference === "keto") return tag !== "vegetarian" || tag === "keto";
      return true;
    });
    const useSavedRecipes = mpIncludeMyRecipes && compatibleRecipes.length > 0;
    const savedByType: Record<string, any[]> = {};
    if (useSavedRecipes) {
      compatibleRecipes.forEach(r => {
        const t = r.type || "dinner";
        if (!savedByType[t]) savedByType[t] = [];
        savedByType[t].push(r);
      });
    }

    const allMeals: any[] = [];
    const todayDayIndex = new Date().getDay();
    for (let day = todayDayIndex; day < 7; day++) {
      const dateStr = format(addDays(currentWeekStart, day), "yyyy-MM-dd");

      mealTypes.forEach((mt, mtIdx) => {
        let usedSaved = false;
        if (useSavedRecipes && savedByType[mt] && savedByType[mt].length > 0 && Math.random() > 0.5) {
          const saved = savedByType[mt][Math.floor(Math.random() * savedByType[mt].length)];
          allMeals.push({
            profileId: profile!.id,
            date: dateStr,
            mealType: mt,
            title: saved.title,
            calories: saved.calories,
            protein: saved.protein,
            carbs: saved.carbs,
            fat: saved.fat,
            time: saved.time,
            ingredients: saved.ingredients,
            steps: saved.steps,
          });
          usedSaved = true;
        }
        if (!usedSaved) {
          const templates = currentTemplates[mt] || currentTemplates.dinner;
          const tplIdx = (day * (mtIdx + 1) + mtIdx) % templates.length;
          const tpl = templates[tplIdx];
          const mealCal = calPerMealType[mt] || Math.round(targetCalories / mealTypes.length);
          const proteinG = Math.round((mealCal * ratios.p) / 4);
          const carbsG = Math.round((mealCal * ratios.c) / 4);
          const fatG = Math.round((mealCal * ratios.f) / 9);

          const templateTotalCal = tpl.ingredients.reduce((s, ing) => s + ing.cal, 0);
          const scaleFactor = templateTotalCal > 0 ? mealCal / templateTotalCal : 1;
          const scaledIngredients = tpl.ingredients.map(ing => ({
            ...ing,
            cal: Math.round(ing.cal * scaleFactor),
          }));

          allMeals.push({
            profileId: profile!.id,
            date: dateStr,
            mealType: mt,
            title: tpl.title,
            calories: mealCal,
            protein: `${proteinG}g`,
            carbs: `${carbsG}g`,
            fat: `${fatG}g`,
            time: tpl.steps.length <= 3 ? "5 min" : `${15 + Math.floor(Math.random() * 4) * 5} min`,
            ingredients: scaledIngredients,
            steps: tpl.steps,
          });
        }
      });
    }

    generateMealPlanMutation.mutate(allMeals, {
      onSettled: () => setMpGenerating(false),
    });
  };

  const prevTargetCaloriesRef = useRef(targetCalories);
  useEffect(() => {
    if (prevTargetCaloriesRef.current !== targetCalories && plannedMealsData.length > 0 && profile?.id) {
      prevTargetCaloriesRef.current = targetCalories;
      handleGenerateWeekPlan();
    } else {
      prevTargetCaloriesRef.current = targetCalories;
    }
  }, [targetCalories]);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayPlannedMeals = plannedMealsData.filter(m => m.date === todayStr);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const aggregatedGroceryList = useCallback(() => {
    const canonicalNames: Record<string, string> = {
      "carrot sticks": "carrots", "carrot": "carrots", "shredded carrot": "carrots",
      "bell pepper strips": "bell pepper", "bell pepper sliced": "bell pepper", "bell peppers": "bell pepper", "red bell pepper": "bell pepper",
      "cherry tomatoes": "tomatoes", "tomato": "tomatoes", "tomato slices": "tomatoes",
      "celery sticks": "celery",
      "garlic cloves": "garlic", "garlic clove": "garlic", "minced garlic": "garlic",
      "baby potatoes": "potatoes", "potato": "potatoes",
      "sweet potatoes": "sweet potato", "roasted sweet potato": "sweet potato",
      "green beans": "green beans",
      "mixed greens": "lettuce", "romaine": "lettuce", "mixed salad": "lettuce",
      "cheddar cheese": "cheese", "shredded cheese": "cheese", "parmesan cheese": "parmesan", "feta cheese": "feta",
      "cream cheese": "cream cheese", "cottage cheese": "cottage cheese",
      "greek yogurt": "yogurt", "plain yogurt": "yogurt",
      "chicken breast": "chicken", "chicken thighs": "chicken", "grilled chicken": "chicken",
      "ground turkey": "turkey", "sliced turkey": "turkey", "turkey bacon": "turkey bacon",
      "turkey sausage": "turkey sausage",
      "lean beef strips": "beef", "ground beef": "beef", "beef strips": "beef",
      "large shrimp": "shrimp",
      "cod fillet": "cod", "salmon fillet": "salmon",
      "whole grain bread": "bread", "whole wheat bread": "bread",
      "whole wheat tortilla": "tortilla",
      "brown rice": "rice", "cilantro lime rice": "rice", "white rice": "rice",
      "rolled oats": "oats", "oat flour": "oats",
      "soba noodles": "noodles", "zucchini noodles": "zucchini",
      "whole wheat pasta": "pasta",
      "olive oil": "olive oil", "cooking spray": "cooking spray", "sesame oil": "sesame oil",
      "almond butter": "almond butter", "peanut butter": "peanut butter",
      "sliced almonds": "almonds", "almond": "almonds",
      "mixed berries": "berries", "frozen mixed berries": "berries", "blueberries": "berries",
      "mini chocolate chips": "chocolate chips", "dark chocolate chips": "chocolate chips",
      "dried cranberries": "cranberries",
      "coconut flakes": "coconut", "coconut milk": "coconut milk",
      "fresh rosemary": "rosemary", "fresh dill": "dill", "fresh parsley": "parsley", "fresh basil": "basil",
      "italian seasoning": "italian seasoning", "garlic powder": "garlic powder",
      "salt & pepper": "salt & pepper", "salt": "salt & pepper",
      "red pepper flakes": "red pepper flakes",
      "lemon juice": "lemon", "lemon zest": "lemon", "lemon sliced": "lemon",
      "lime dressing": "lime",
      "soy-ginger sauce": "soy sauce", "soy sauce": "soy sauce",
      "maple syrup": "maple syrup",
      "protein powder": "protein powder",
      "rice cakes": "rice cakes", "rice cake": "rice cakes",
    };

    const normalize = (s: string) => s.toLowerCase().trim()
      .replace(/\b(fresh|dried|frozen|chopped|diced|sliced|minced|shredded|grated|crushed|whole|raw|cooked|large|medium|small|plain)\b/g, '')
      .replace(/\b(sticks?|strips?|pieces?|chunks?|cubes?|halved|florets?|spears?|cloves?|leaves?)\b/g, '')
      .replace(/\s+/g, ' ').trim();
    const singularize = (s: string) => s.replace(/ies$/, 'y').replace(/ves$/, 'f').replace(/([^s])s$/, '$1');

    const getCanonicalKey = (name: string): string => {
      const lower = name.toLowerCase().trim();
      if (canonicalNames[lower]) return canonicalNames[lower];
      const normalized = normalize(lower);
      if (canonicalNames[normalized]) return canonicalNames[normalized];
      const singular = singularize(normalized);
      for (const [variant, canonical] of Object.entries(canonicalNames)) {
        const normVariant = normalize(variant);
        if (singular === singularize(normVariant) || singular.includes(singularize(normVariant)) || singularize(normVariant).includes(singular)) {
          return canonical;
        }
      }
      return lower;
    };

    const getDisplayName = (canonicalKey: string, originalNames: string[]): string => {
      if (canonicalNames[canonicalKey]) {
        return canonicalKey.charAt(0).toUpperCase() + canonicalKey.slice(1);
      }
      const shortest = originalNames.reduce((a, b) => a.length <= b.length ? a : b);
      return shortest;
    };

    const itemMap: Record<string, { item: string; amounts: string[]; totalCal: number; originalNames: string[] }> = {};
    plannedMealsData.forEach(meal => {
      const ings = meal.ingredients as { item: string; amount: string; cal: number }[] | null;
      if (!ings || !Array.isArray(ings)) return;
      ings.forEach(ing => {
        const key = getCanonicalKey(ing.item);
        if (!itemMap[key]) {
          itemMap[key] = { item: ing.item, amounts: [], totalCal: 0, originalNames: [] };
        }
        itemMap[key].amounts.push(ing.amount);
        itemMap[key].totalCal += ing.cal || 0;
        if (!itemMap[key].originalNames.includes(ing.item)) {
          itemMap[key].originalNames.push(ing.item);
        }
      });
    });

    Object.keys(itemMap).forEach(key => {
      const entry = itemMap[key];
      entry.item = getDisplayName(key, entry.originalNames);
    });

    const categories: Record<string, string[]> = {
      "Proteins": ["chicken", "turkey", "beef", "salmon", "shrimp", "cod", "egg", "tofu", "bacon", "sausage", "ham", "pork", "jerky", "collagen"],
      "Dairy & Eggs": ["yogurt", "cheese", "cream cheese", "mozzarella", "feta", "parmesan", "cheddar", "butter", "milk", "cottage cheese", "sour cream"],
      "Grains & Bread": ["oat", "rice", "quinoa", "pasta", "noodle", "tortilla", "bread", "granola", "farro", "flour", "crouton", "breadcrumb", "rice cake", "pita"],
      "Fruits": ["banana", "apple", "berr", "lemon", "lime", "pineapple", "cranberr", "avocado"],
      "Vegetables": ["spinach", "broccoli", "pepper", "tomato", "cucumber", "carrot", "celery", "onion", "garlic", "zucchini", "asparagus", "potato", "corn", "kale", "lettuce", "bean sprout", "mushroom", "eggplant", "sweet potato", "green bean", "edamame", "olive"],
      "Nuts & Seeds": ["almond", "peanut", "walnut", "chia", "pumpkin seed", "sesame", "coconut", "macadamia", "trail mix"],
      "Pantry & Sauces": ["oil", "honey", "maple", "soy sauce", "vinaigrette", "salsa", "hummus", "tahini", "curry", "marinara", "cocoa", "chocolate", "protein powder", "pad thai", "teriyaki", "mustard", "dressing", "glaze", "mct"],
      "Spices & Herbs": ["cumin", "cinnamon", "rosemary", "thyme", "dill", "basil", "parsley", "chive", "ginger", "seasoning", "salt", "pepper", "flakes", "italian", "garlic powder", "stevia"],
    };
    const categorized: Record<string, { item: string; amounts: string[]; totalCal: number; originalNames: string[] }[]> = {};
    const uncategorized: typeof itemMap[string][] = [];
    Object.values(itemMap).forEach(entry => {
      const key = entry.item.toLowerCase();
      let placed = false;
      for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some(kw => key.includes(kw))) {
          if (!categorized[cat]) categorized[cat] = [];
          categorized[cat].push(entry);
          placed = true;
          break;
        }
      }
      if (!placed) uncategorized.push(entry);
    });
    if (uncategorized.length > 0) categorized["Other"] = uncategorized;
    return categorized;
  }, [plannedMealsData]);

  const handleOpenGroceryList = () => {
    const list = aggregatedGroceryList();
    const initialChecked: Record<string, boolean> = {};
    Object.values(list).flat().forEach(entry => {
      initialChecked[entry.item.toLowerCase().trim()] = true;
    });
    setGroceryChecked(initialChecked);
    setGroceryCopied(false);
    setGroceryListOpen(true);
  };

  const buildGroceryText = () => {
    const list = aggregatedGroceryList();
    const lines: string[] = [`${profile?.name || "My"}'s Grocery List`, "", "Tip: In Apple Notes, select all items → tap Aa → Checklist to make them tappable checkboxes.", ""];
    const categoryOrder = ["Proteins", "Dairy & Eggs", "Grains & Bread", "Fruits", "Vegetables", "Nuts & Seeds", "Pantry & Sauces", "Spices & Herbs", "Other"];
    categoryOrder.forEach(cat => {
      if (!list[cat]) return;
      const selected = list[cat].filter(e => groceryChecked[e.item.toLowerCase().trim()]);
      if (selected.length === 0) return;
      lines.push(`${cat}:`);
      selected.forEach(entry => {
        const qty = entry.amounts.length > 1 ? `${entry.amounts.length}x needed` : entry.amounts[0];
        lines.push(`- ${entry.item} (${qty})`);
      });
      lines.push("");
    });
    return lines.join("\n").trim();
  };

  const handleExportGroceryList = () => {
    const text = buildGroceryText();
    navigator.clipboard.writeText(text).then(() => {
      setGroceryCopied(true);
      setTimeout(() => setGroceryCopied(false), 2000);
    });
  };

  const handleShareGroceryList = async () => {
    const text = buildGroceryText();
    if (navigator.share) {
      try {
        await navigator.share({ title: `${profile?.name || "My"}'s Grocery List`, text });
      } catch (_) {}
    } else {
      handleExportGroceryList();
    }
  };

  const handleGenerateRecipe = () => {
    setIsGenerating(true);
    setGeneratedRecipe(null);

    setTimeout(() => {
      const userIngredients = generatorIngredients.split(',').map(s => s.trim()).filter(Boolean);
      const mealCal = Math.round(targetCalories / 3);
      const cat = genMealType;
      const proteinLabel = genProteinSource === "vegetarian" ? "Tofu" : genProteinSource.charAt(0).toUpperCase() + genProteinSource.slice(1);
      const nouns: Record<string, string[]> = {
        breakfast: ["Scramble", "Bowl", "Plate"],
        lunch: ["Bowl", "Salad", "Wrap"],
        dinner: ["Skillet", "Stir-fry", "Roast"],
        snack: ["Bites", "Plate", "Cup"]
      };
      const catNouns = nouns[cat] || nouns.dinner;
      const noun = catNouns[Math.floor(Math.random() * catNouns.length)];
      const adjectives = ["Zesty", "Savory", "Herb-Crusted", "Golden", "Spiced", "Seared", "Roasted", "Fresh"];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const mainIng = proteinLabel;
      const title = `${adj} ${mainIng} ${noun}`;

      const proteinG = Math.round((mealCal * 0.3) / 4);
      const carbsG = Math.round((mealCal * 0.4) / 4);
      const fatG = Math.round((mealCal * 0.3) / 9);

      const ingredients: { item: string; amount: string; cal: number }[] = [];
      const allIngs = [proteinLabel, ...userIngredients];
      const calPerIng = Math.round(mealCal / (allIngs.length + 3));

      allIngs.forEach((ing, idx) => {
        const portions = ["4 oz (115g)", "1 cup", "½ cup", "3 oz (85g)", "2 oz (55g)"];
        ingredients.push({
          item: ing.charAt(0).toUpperCase() + ing.slice(1),
          amount: portions[idx % portions.length],
          cal: idx === 0 ? Math.round(calPerIng * 1.5) : calPerIng
        });
      });

      ingredients.push({ item: "Olive oil", amount: "1 tbsp", cal: 120 });
      ingredients.push({ item: "Seasoning & spices", amount: "1 tsp blend", cal: 5 });
      ingredients.push({ item: "Salt and pepper", amount: "To taste", cal: 0 });

      const currentTotal = ingredients.reduce((s, i) => s + i.cal, 0);
      if (currentTotal < mealCal && ingredients.length > 0) {
        ingredients[0].cal += (mealCal - currentTotal);
      }

      const stepSets: Record<string, string[]> = {
        Bowl: [
          `Cook your base grain according to package directions and set aside.`,
          `Season ${mainIng.toLowerCase()} with spices, salt, and pepper.`,
          `Cook ${mainIng.toLowerCase()} in a skillet over medium-high heat until done.`,
          `Prepare remaining ingredients: ${userIngredients.slice(1).join(', ') || 'your toppings'}.`,
          `Assemble the bowl with the grain base, ${mainIng.toLowerCase()}, and toppings. Drizzle with sauce and serve.`
        ],
        Salad: [
          `Wash and chop all greens and vegetables.`,
          `Season and cook ${mainIng.toLowerCase()} until golden and cooked through.`,
          `Arrange the greens in a large bowl.`,
          `Top with ${mainIng.toLowerCase()}, ${userIngredients.slice(1).join(', ') || 'fresh toppings'}, and any extras.`,
          `Whisk together a simple dressing, drizzle over the salad, and serve.`
        ],
        Wrap: [
          `Warm a tortilla in a dry skillet for 30 seconds per side.`,
          `Season and cook ${mainIng.toLowerCase()} in a skillet until done.`,
          `Spread hummus or sauce across the center of the tortilla.`,
          `Layer ${mainIng.toLowerCase()}, ${userIngredients.slice(1).join(', ') || 'lettuce and vegetables'}.`,
          `Fold in the sides, roll tightly, slice in half, and serve.`
        ],
        Skillet: [
          `Season ${mainIng.toLowerCase()} generously with salt, pepper, and spices.`,
          `Heat oil in a large skillet over medium-high heat.`,
          `Sear ${mainIng.toLowerCase()} for 3-4 minutes per side until golden, then set aside.`,
          `In the same skillet, sauté ${userIngredients.slice(1).join(', ') || 'diced vegetables'} until tender.`,
          `Return ${mainIng.toLowerCase()} to the skillet, add sauce, and simmer to combine.`
        ],
        "Stir-fry": [
          `Slice ${mainIng.toLowerCase()} thinly and prep ${userIngredients.slice(1).join(', ') || 'vegetables'}.`,
          `Heat a wok or large skillet over high heat with oil.`,
          `Cook ${mainIng.toLowerCase()} for 2-3 minutes until just done, then remove.`,
          `Stir-fry the remaining ingredients for 3-4 minutes.`,
          `Return ${mainIng.toLowerCase()}, add soy sauce and seasoning, toss, and serve over rice.`
        ],
        Roast: [
          `Preheat oven to 400°F (200°C) and line a baking sheet with parchment.`,
          `Season ${mainIng.toLowerCase()} with herbs, garlic, olive oil, salt, and pepper.`,
          `Arrange ${mainIng.toLowerCase()} in the center, surround with ${userIngredients.slice(1).join(', ') || 'chopped vegetables'}.`,
          `Roast for 25-35 minutes until cooked through and golden.`,
          `Let rest 5 minutes, plate, and serve.`
        ]
      };

      const totalCal = mealCal * genServings;
      const dietaryTag = genProteinSource === "vegetarian" ? "vegetarian" : "balanced";
      setGeneratedRecipe({
        id: Date.now(),
        title,
        type: cat,
        cuisine: "custom",
        dietaryTag,
        calories: totalCal,
        protein: `${proteinG * genServings}g`,
        carbs: `${carbsG * genServings}g`,
        fat: `${fatG * genServings}g`,
        time: `${15 + Math.floor(Math.random() * 4) * 5} min`,
        image: null,
        match: `${genServings} serving${genServings > 1 ? 's' : ''}`,
        ingredients: ingredients.map(i => ({ ...i, cal: i.cal * genServings, amount: genServings > 1 ? `${genServings}x ${i.amount}` : i.amount })),
        steps: stepSets[noun] || stepSets.Skillet
      });
      setIsGenerating(false);
    }, 1200);
  };

  const allRecipes = getDailyRecipes();

  const dailyPlanRecipes = allRecipes.filter(r => r.cuisine === 'all');
  const recipes = mealType === "all" ? dailyPlanRecipes : dailyPlanRecipes.filter(r => r.type === mealType);

  return (
    <div className="min-h-screen bg-green-50/40 dark:bg-slate-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 items-center">
            <div className="flex items-center gap-2 text-primary">
              <Activity className="h-6 w-6" />
              <span className="font-display font-bold text-xl tracking-tight">CalorieZone</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 mr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Weight</span>
                  {editingWeight ? (
                    <input
                      ref={weightInputRef}
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      onBlur={handleWeightSave}
                      onKeyDown={(e) => { if (e.key === "Enter") { handleWeightSave(); (e.target as HTMLInputElement).blur(); } if (e.key === "Escape") setEditingWeight(false); }}
                      className="w-14 text-sm font-bold text-slate-800 dark:text-slate-200 bg-primary/10 border border-primary/30 rounded px-1 text-center outline-none"
                      autoFocus
                      data-testid="input-quick-weight-desktop"
                    />
                  ) : (
                    <button onClick={handleWeightEdit} className="text-sm font-bold text-slate-800 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 hover:border-primary/50 hover:bg-primary/5 transition-colors" data-testid="text-current-weight">
                      {currentWeight ?? "—"}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Goal</span>
                  {editingGoal ? (
                    <input
                      ref={goalInputRef}
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      onBlur={handleGoalSave}
                      onKeyDown={(e) => { if (e.key === "Enter") { handleGoalSave(); (e.target as HTMLInputElement).blur(); } if (e.key === "Escape") setEditingGoal(false); }}
                      className="w-14 text-sm font-bold text-primary bg-primary/10 border border-primary/30 rounded px-1 text-center outline-none"
                      autoFocus
                      data-testid="input-quick-goal-desktop"
                    />
                  ) : (
                    <button onClick={handleGoalEdit} className="text-sm font-bold text-primary rounded border border-primary/20 px-1.5 py-0.5 hover:border-primary/50 hover:bg-primary/5 transition-colors" data-testid="text-target-weight">
                      {targetWeight ?? "—"}
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">lbs</span>
                <div className="text-slate-200 dark:text-slate-700">|</div>
                <div className="flex flex-col items-center gap-0.5 w-28">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Progress</span>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                      style={{ width: `${Math.min(100, progressPercentage)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-primary" data-testid="text-progress-percent">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.avatarSeed || "Felix"}`}
                alt="User avatar"
                className="h-8 w-8 rounded-full bg-muted cursor-pointer"
                onClick={() => setEditProfileOpen(true)}
                data-testid="button-avatar"
              />
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setEditProfileOpen(true)}
                data-testid="button-edit-profile"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-24 sm:pb-8 space-y-3 sm:space-y-8">
        
        {/* Compact Header + Progress */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm sm:text-2xl font-display font-bold text-foreground leading-tight whitespace-nowrap">Hi, {profile?.name || "there"}</h1>
          </div>
          <div className="flex items-center gap-1 sm:hidden">
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Weight</span>
              {editingWeight ? (
                <input
                  ref={weightInputRef}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  onBlur={handleWeightSave}
                  onKeyDown={(e) => { if (e.key === "Enter") { handleWeightSave(); (e.target as HTMLInputElement).blur(); } if (e.key === "Escape") setEditingWeight(false); }}
                  className="w-10 text-[11px] font-bold text-slate-800 dark:text-slate-200 bg-primary/10 border border-primary/30 rounded px-0.5 text-center outline-none"
                  autoFocus
                  data-testid="input-quick-weight"
                />
              ) : (
                <button onClick={handleWeightEdit} className="text-[11px] font-bold text-slate-800 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-600 px-1 py-0.5 hover:border-primary/50 hover:bg-primary/5 transition-colors" data-testid="button-quick-weight">
                  {currentWeight ?? "—"}
                </button>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Goal</span>
              {editingGoal ? (
                <input
                  ref={goalInputRef}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onBlur={handleGoalSave}
                  onKeyDown={(e) => { if (e.key === "Enter") { handleGoalSave(); (e.target as HTMLInputElement).blur(); } if (e.key === "Escape") setEditingGoal(false); }}
                  className="w-10 text-[11px] font-bold text-primary bg-primary/10 border border-primary/30 rounded px-0.5 text-center outline-none"
                  autoFocus
                  data-testid="input-quick-goal"
                />
              ) : (
                <button onClick={handleGoalEdit} className="text-[11px] font-bold text-primary rounded border border-primary/20 px-1 py-0.5 hover:border-primary/50 hover:bg-primary/5 transition-colors" data-testid="button-quick-goal">
                  {targetWeight ?? "—"}
                </button>
              )}
            </div>
            <span className="text-[9px] text-muted-foreground">lbs</span>
            <div className="text-slate-200 dark:text-slate-700 text-[10px]">|</div>
            <div className="flex items-center gap-0.5">
              <div className="w-10 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full" style={{ width: `${Math.min(100, progressPercentage)}%` }} />
              </div>
              <span className="text-[9px] font-bold text-primary">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

          <div className="lg:col-span-7 space-y-6 sm:space-y-8" ref={trackerSectionRef}>
            {/* Calories Tracker Card */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 relative flex flex-col rounded-xl">
              <div className="h-2 bg-secondary w-full rounded-t-xl"></div>
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <Flame className="h-32 w-32 text-secondary" />
              </div>
              <CardHeader className="pb-1 sm:pb-2 pt-4 sm:pt-6 px-4 sm:px-6 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-secondary" />
                    Daily Targets & Tracker
                  </CardTitle>
                  {!isViewingToday && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(new Date())}
                      className="text-xs h-7 px-2.5 text-secondary border-secondary/30 hover:bg-secondary/10"
                      data-testid="button-go-to-today"
                    >
                      Today
                    </Button>
                  )}
                </div>

                <div className="pt-3" data-testid="date-navigator">
                  <div className="flex items-center">
                    <button
                      className="h-7 w-7 shrink-0 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full"
                      onClick={() => setSelectedDate(prev => subDays(prev, 7))}
                      data-testid="button-prev-week"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-7 flex-1 gap-0.5">
                      {Array.from({ length: 7 }, (_, i) => {
                        const weekStart = subDays(selectedDate, selectedDate.getDay());
                        const day = addDays(weekStart, i);
                        const isSelected = isSameDay(day, selectedDate);
                        const isDayToday = isToday(day);
                        const isFuture = day > new Date();
                        return (
                          <button
                            key={i}
                            disabled={isFuture}
                            onClick={() => setSelectedDate(day)}
                            className={`flex flex-col items-center py-1.5 rounded-lg transition-all min-h-[44px] justify-center ${
                              isSelected
                                ? "bg-secondary text-white shadow-sm"
                                : isDayToday
                                ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
                                : isFuture
                                ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                            data-testid={`day-button-${format(day, "yyyy-MM-dd")}`}
                          >
                            <span className={`text-[10px] font-medium uppercase leading-none ${isSelected ? "text-white/80" : ""}`}>
                              {format(day, "EEE")}
                            </span>
                            <span className={`text-sm font-bold leading-none mt-1 ${isSelected ? "text-white" : ""}`}>
                              {format(day, "d")}
                            </span>
                            {isDayToday && !isSelected && (
                              <div className="w-1 h-1 rounded-full bg-secondary mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      className="h-7 w-7 shrink-0 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full disabled:opacity-30"
                      onClick={() => {
                        const nextWeek = addDays(selectedDate, 7);
                        if (nextWeek <= new Date()) setSelectedDate(nextWeek);
                        else setSelectedDate(new Date());
                      }}
                      disabled={isViewingToday}
                      data-testid="button-next-week"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-1.5">
                  {isViewingToday ? "Today" : format(selectedDate, "EEEE")}, {format(selectedDate, "MMMM d, yyyy")}
                </p>
              </CardHeader>
              <CardContent className="relative z-10 space-y-3 sm:space-y-6">
                
                {(() => {
                  const consumed = trackedFoods.reduce((acc, food) => acc + food.calories, 0);
                  const adjustedTarget = targetCalories + exerciseCaloriesBonus;
                  const remaining = adjustedTarget - consumed;
                  return (
                    <>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-slate-100">{consumed}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">Added</div>
                        </div>
                        <div className={`rounded-lg py-1 ${remaining > 0 ? 'bg-secondary/10' : 'bg-red-50 dark:bg-red-950/30'}`}>
                          <div className={`text-xl sm:text-2xl font-display font-bold ${remaining > 0 ? 'text-secondary' : 'text-red-500'}`}>
                            {remaining > 0 ? remaining : Math.abs(remaining)}
                          </div>
                          <div className={`text-[10px] uppercase tracking-wide font-medium ${remaining > 0 ? 'text-secondary/70' : 'text-red-400'}`}>
                            {remaining > 0 ? 'Left' : 'Over'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xl sm:text-2xl font-display font-bold text-slate-400 dark:text-slate-500">{adjustedTarget}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                            Target{exerciseCaloriesBonus > 0 && <span className="text-primary ml-0.5">(+{exerciseCaloriesBonus})</span>}
                          </div>
                        </div>
                      </div>

                      <Progress 
                        value={Math.min(100, (consumed / adjustedTarget) * 100)} 
                        className="h-2 bg-slate-100 dark:bg-slate-800" 
                        indicatorClassName={consumed > adjustedTarget ? "bg-red-500" : "bg-secondary"}
                      />
                    </>
                  );
                })()}

                {/* Add Custom Food */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Add</h4>
                  <div className="flex flex-wrap gap-2">
                      {frequentFoods.length > 0 && (
                        <Popover open={quickAddOpen} onOpenChange={setQuickAddOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 gap-1.5 text-xs border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                              data-testid="button-quick-add-frequent"
                            >
                              Add Recent
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
                            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent &amp; Frequent</p>
                              <p className="text-xs text-muted-foreground">Select items to add to today's log</p>
                            </div>
                            <div className="max-h-[260px] overflow-y-auto p-2 space-y-1">
                              {frequentFoods.map((food, idx) => {
                                const isChecked = quickAddSelected.has(idx);
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setQuickAddSelected(prev => {
                                        const next = new Set(prev);
                                        if (next.has(idx)) next.delete(idx);
                                        else next.add(idx);
                                        return next;
                                      });
                                    }}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                                      isChecked
                                        ? 'bg-primary/5 border border-primary/20 ring-1 ring-primary/10'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                                    }`}
                                    data-testid={`quick-add-item-${idx}`}
                                  >
                                    <Checkbox
                                      checked={isChecked}
                                      className="h-4.5 w-4.5 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary pointer-events-none"
                                      tabIndex={-1}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{food.name}</p>
                                      <p className="text-[11px] text-muted-foreground">
                                        {food.calories} cal · {food.frequency}x logged
                                      </p>
                                    </div>
                                    <span className="text-xs font-semibold text-secondary shrink-0">{food.calories}</span>
                                  </button>
                                );
                              })}
                            </div>
                              <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                  {quickAddSelected.size > 0 ? (
                                    <>{quickAddSelected.size} selected · <span className="font-semibold text-secondary">
                                      {Array.from(quickAddSelected).reduce((sum, idx) => sum + frequentFoods[idx].calories, 0)} cal
                                    </span></>
                                  ) : (
                                    <>Select items above</>
                                  )}
                                </p>
                                <Button
                                  size="sm"
                                  className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
                                  disabled={quickAddSelected.size === 0}
                                  onClick={() => {
                                    Array.from(quickAddSelected).forEach(idx => {
                                      const f = frequentFoods[idx];
                                      addFoodMutation.mutate({
                                        name: f.name,
                                        calories: f.calories,
                                        protein: f.protein,
                                        carbs: f.carbs,
                                        fat: f.fat,
                                      });
                                    });
                                    toast({
                                      title: `Added ${quickAddSelected.size} item${quickAddSelected.size > 1 ? 's' : ''}`,
                                      description: `Logged to ${isViewingToday ? "today's" : format(selectedDate, "MMM d") + "'s"} diary`,
                                    });
                                    setQuickAddSelected(new Set());
                                    setQuickAddOpen(false);
                                  }}
                                  data-testid="button-quick-add-confirm"
                                >
                                  <Plus className="h-3.5 w-3.5 mr-1" />
                                  Add{quickAddSelected.size > 0 ? ` ${quickAddSelected.size}` : ''}
                                </Button>
                              </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      <BarcodeScanner onLog={(food) => {
                        addFoodMutation.mutate(food);
                      }} />
                      <MealScanner
                        onLog={(food) => { addFoodMutation.mutate(food); }}
                        externalOpen={mealScannerOpen}
                        onExternalOpenChange={setMealScannerOpen}
                      />
                  </div>
                  <FoodSearch onAdd={(food) => addFoodMutation.mutate(food)} frequentFoods={frequentFoods} />
                </div>

                {/* Logged Foods List */}
                {trackedFoods.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{isViewingToday ? "Today's Log" : format(selectedDate, "MMM d") + " Log"}</h4>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {trackedFoods.map(food => (
                        <div key={food.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group transition-colors">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate pr-2">{food.name}</span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">{food.calories} kcal</span>
                            <button 
                              onClick={() => handleRemoveFood(food.id)}
                              className="text-slate-400 hover:text-red-500 active:text-red-600 transition-colors p-1 -mr-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30"
                              data-testid={`button-remove-food-${food.id}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Dumbbell className="h-4 w-4 text-accent" />
                    Exercise
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => { setExerciseDialogOpen(true); setSelectedExercise(null); setExerciseSearch(""); setExerciseDuration(30); }}
                      className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 bg-accent/10 hover:bg-accent/20 px-2.5 py-1.5 rounded-lg transition-colors"
                      data-testid="button-add-exercise"
                    >
                      <Plus className="h-3 w-3" />
                      Add Exercise
                    </button>
                    {exerciseCaloriesBonus > 0 && (
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">+{exerciseCaloriesBonus} cal earned</span>
                    )}
                  </div>
                  {exerciseEntries.length > 0 && (
                    <div className="space-y-1.5">
                      {exerciseEntries.map(entry => (
                        <div key={entry.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-accent/5 dark:bg-accent/10 border border-accent/10 dark:border-accent/20 group" data-testid={`exercise-entry-${entry.id}`}>
                          <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                            <Footprints className="h-3.5 w-3.5 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{entry.name}</p>
                            <p className="text-[10px] text-muted-foreground">{entry.duration} min · {entry.caloriesBurned} cal burned · <span className="text-primary font-semibold">+{Math.round(entry.caloriesBurned * 0.5)} earned</span></p>
                          </div>
                          <button
                            onClick={() => removeExerciseMutation.mutate(entry.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100"
                            data-testid={`button-remove-exercise-${entry.id}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {exerciseEntries.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">No exercises logged. Add an exercise to earn extra calories.</p>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-center">
                    <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-0.5">Maintain</div>
                    <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">{maintenanceCalories}</div>
                    <div className="text-[10px] text-muted-foreground">kcal/day</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-center">
                    <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-0.5">Target</div>
                    <div className="font-bold text-secondary text-sm">{targetCalories}</div>
                    <div className="text-[10px] text-muted-foreground">kcal/day</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-center">
                    <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                      {isGainingWeight ? 'Surplus' : 'Deficit'}
                    </div>
                    <div className="font-bold text-secondary text-sm">
                      {isGainingWeight ? '+' : '-'}{Math.round(dailyDifference)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">kcal/day</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
                    <PieChartIcon className="h-4 w-4 text-accent" />
                    Macros
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Protein", current: totalProtein, target: targetProtein, color: "bg-blue-500", textColor: "text-blue-600" },
                      { label: "Carbs", current: totalCarbs, target: targetCarbs, color: "bg-emerald-500", textColor: "text-emerald-600" },
                      { label: "Fat", current: totalFat, target: targetFat, color: "bg-amber-500", textColor: "text-amber-600" },
                    ].map((macro) => {
                      const pct = macro.target > 0 ? Math.min(100, Math.round((macro.current / macro.target) * 100)) : 0;
                      return (
                        <div key={macro.label} data-testid={`macro-bar-${macro.label.toLowerCase()}`}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${macro.color}`}></div>
                              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{macro.label}</span>
                            </div>
                            <span className="text-xs font-semibold">
                              <span className={macro.textColor}>{macro.current}g</span>
                              <span className="text-muted-foreground"> / {macro.target}g</span>
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${macro.color} transition-all duration-500`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                          <div className="text-right mt-0.5">
                            <span className="text-[10px] font-semibold text-muted-foreground">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5" ref={mealPlannerRef}>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 relative flex flex-col rounded-xl h-full">
              <div className="h-2 bg-primary w-full rounded-t-xl"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2 text-lg">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Meal Planner
                </CardTitle>
                <CardDescription>Plan your meals for the week</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Week Progress</Label>
                  <div className="flex gap-1">
                    {dayNames.map((d, i) => {
                      const dayDate = format(addDays(currentWeekStart, i), "yyyy-MM-dd");
                      const hasMeals = plannedMealsData.some(m => m.date === dayDate);
                      const isPast = addDays(currentWeekStart, i) < new Date() && !isSameDay(addDays(currentWeekStart, i), new Date());
                      const isTodayBar = isSameDay(addDays(currentWeekStart, i), new Date());
                      return (
                        <div key={d} className="flex-1 flex flex-col items-center gap-1" data-testid={`week-bar-${d.toLowerCase()}`}>
                          <span className={`text-[9px] font-bold uppercase ${isTodayBar ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>{d}</span>
                          <div className={`w-full h-6 rounded-md transition-all ${
                            hasMeals && isPast ? 'bg-primary' :
                            hasMeals && isTodayBar ? 'bg-primary/70 ring-2 ring-primary/30' :
                            hasMeals ? 'bg-primary/40' :
                            'bg-slate-100 dark:bg-slate-800'
                          }`}>
                            {hasMeals && isPast && (
                              <div className="flex items-center justify-center h-full">
                                <Check className="h-3.5 w-3.5 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {todayPlannedMeals.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Today's Meals</Label>
                      <span className="text-[10px] text-muted-foreground bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">{todayPlannedMeals.length} meals</span>
                    </div>
                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                      {todayPlannedMeals.map(meal => {
                        const isLogged = loggedMealIds.has(meal.id);
                        return (
                          <div key={meal.id} className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                            isLogged
                              ? 'border-primary/20 bg-primary/5 dark:bg-primary/10'
                              : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'
                          }`} data-testid={`planned-meal-${meal.id}`}>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              meal.mealType === 'breakfast' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                              meal.mealType === 'lunch' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                              meal.mealType === 'dinner' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                              'bg-green-100 dark:bg-green-900/30 text-green-600'
                            }`}>
                              {meal.mealType === 'breakfast' ? <Coffee className="h-3.5 w-3.5" /> :
                               meal.mealType === 'lunch' ? <UtensilsCrossed className="h-3.5 w-3.5" /> :
                               meal.mealType === 'dinner' ? <Utensils className="h-3.5 w-3.5" /> :
                               <Cookie className="h-3.5 w-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium truncate ${isLogged ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{meal.title}</p>
                              <p className="text-[10px] text-muted-foreground">{meal.calories} cal</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                onClick={() => setSelectedRecipe({
                                  ...meal,
                                  type: meal.mealType,
                                  match: meal.mealType,
                                  cuisine: "planned",
                                  image: null,
                                })}
                                data-testid={`button-view-meal-${meal.id}`}
                              >
                                <Eye className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                              </button>
                              <button
                                className={`p-1.5 rounded-md border transition-colors ${
                                  isLogged
                                    ? 'border-primary/30 bg-primary/10 cursor-default'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10'
                                }`}
                                disabled={isLogged}
                                onClick={() => {
                                  addRecipeToTracker(meal);
                                  toast({
                                    title: `Logged ${meal.title}`,
                                    description: `${meal.calories} cal added to today's diary`,
                                  });
                                }}
                                data-testid={`button-log-meal-${meal.id}`}
                              >
                                {isLogged ? (
                                  <Check className="h-3 w-3 text-primary" />
                                ) : (
                                  <Plus className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => {
                        setActiveRecipesTab("planned");
                        setTimeout(() => {
                          recipesTabRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 100);
                      }}
                      className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 active:bg-primary/80 py-3 rounded-xl shadow-sm transition-all"
                      data-testid="view-full-plan-button"
                    >
                      <CalendarDays className="h-4 w-4" />
                      View Full Week Plan
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center py-4">
                    <p className="text-sm text-muted-foreground text-center">No meals planned yet. Generate a plan below.</p>
                  </div>
                )}

                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Include Meals</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Breakfast", checked: mpBreakfast, set: setMpBreakfast, icon: <Coffee className="h-3.5 w-3.5" /> },
                      { label: "Lunch", checked: mpLunch, set: setMpLunch, icon: <UtensilsCrossed className="h-3.5 w-3.5" /> },
                      { label: "Dinner", checked: mpDinner, set: setMpDinner, icon: <Utensils className="h-3.5 w-3.5" /> },
                      { label: "Snacks", checked: mpSnacks, set: setMpSnacks, icon: <Cookie className="h-3.5 w-3.5" /> },
                    ].map(item => (
                      <label key={item.label} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                        item.checked
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}>
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={(v) => item.set(!!v)}
                          data-testid={`checkbox-${item.label.toLowerCase()}`}
                        />
                        {item.icon}
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                      </label>
                    ))}
                  </div>
                  {mpSnacks && (
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-slate-600 dark:text-slate-400">Number of snacks:</Label>
                      <Select value={String(mpSnackCount)} onValueChange={(v) => setMpSnackCount(Number(v))}>
                        <SelectTrigger className="w-16 h-8 text-xs" data-testid="select-snack-count">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Meal Preference</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { value: "balanced", label: "Balanced" },
                      { value: "high-protein", label: "High Protein" },
                      { value: "keto", label: "Keto" },
                      { value: "vegetarian", label: "Vegetarian" },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setMpPreference(opt.value)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          mpPreference === opt.value
                            ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                        data-testid={`button-pref-${opt.value}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
                  savedRecipesData.length === 0
                    ? 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
                    : mpIncludeMyRecipes
                      ? 'border-primary bg-primary/5 dark:bg-primary/10 cursor-pointer'
                      : 'border-slate-200 dark:border-slate-700 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600'
                }`}>
                  <Checkbox
                    checked={mpIncludeMyRecipes}
                    onCheckedChange={(v) => setMpIncludeMyRecipes(!!v)}
                    disabled={savedRecipesData.length === 0}
                    data-testid="checkbox-include-my-recipes"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Include My Recipes</span>
                    {savedRecipesData.length === 0 && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">Save recipes first to enable this</p>
                    )}
                  </div>
                  <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
                </label>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white h-10"
                  onClick={() => {
                    handleGenerateWeekPlan();
                    setTimeout(() => {
                      setActiveRecipesTab("planned");
                      recipesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 500);
                  }}
                  disabled={mpGenerating || (!mpBreakfast && !mpLunch && !mpDinner && !mpSnacks)}
                  data-testid="button-generate-meal-plan"
                >
                  {mpGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Generating...
                    </span>
                  ) : plannedMealsData.length > 0 ? (
                    "Regenerate Week Plan"
                  ) : (
                    "Generate Week Plan"
                  )}
                </Button>

                {plannedMealsData.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full h-9 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                      onClick={handleOpenGroceryList}
                      data-testid="button-grocery-list"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                      Grocery List
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground">
                      Generated meals appear in the Recipes section below
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recipes & Meals */}
          <div className="lg:col-span-12 space-y-6" ref={recipesSectionRef}>
            
            <Tabs value={activeRecipesTab ?? (plannedMealsData.length > 0 ? "planned" : "recommended")} onValueChange={setActiveRecipesTab} className="w-full" ref={recipesTabRef}>
              <div className="flex flex-col gap-3 mb-6">
                <div className="overflow-x-auto -mx-1 px-1">
                  <TabsList className="bg-white dark:bg-slate-900 p-1 border border-slate-100 dark:border-slate-800 shadow-sm rounded-xl w-full sm:w-auto">
                    <TabsTrigger value="recommended" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-xs sm:text-sm px-2.5 sm:px-3">
                      Recommended
                    </TabsTrigger>
                    {plannedMealsData.length > 0 && (
                      <TabsTrigger value="planned" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-xs sm:text-sm px-2.5 sm:px-3">
                        <CalendarDays className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                        Meal Plan
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white transition-all text-xs sm:text-sm px-2.5 sm:px-3">
                      <Bookmark className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                      My Recipes
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {(activeRecipesTab === "planned" || (!activeRecipesTab && plannedMealsData.length > 0)) && (
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm w-fit">
                    <Calendar className="h-4 w-4" />
                    Today's Plan
                  </div>
                )}
              </div>

              {plannedMealsData.length > 0 && (
                <TabsContent value="planned" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-6">
                    <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      Your Weekly Meal Plan
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {targetCalories} kcal/day · {format(currentWeekStart, "MMM d")} – {format(currentWeekEnd, "MMM d, yyyy")}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {(() => {
                      const allDayEntries = Array.from({ length: 7 }, (_, i) => {
                        const dayDate = addDays(currentWeekStart, i);
                        const dayDateStr = format(dayDate, "yyyy-MM-dd");
                        const dayMeals = plannedMealsData.filter(m => m.date === dayDateStr);
                        const dayIsPast = dayDate < new Date() && !isSameDay(dayDate, new Date());
                        const dayIsToday = isSameDay(dayDate, new Date());
                        const dayIsFuture = dayDate > new Date() && !dayIsToday;
                        const hasMeals = dayMeals.length > 0;
                        return { dayDate, dayDateStr, dayMeals, dayIsPast, dayIsToday, dayIsFuture, hasMeals, index: i };
                      });

                      const pastDaysWithMeals = allDayEntries.filter(d => d.dayIsPast && d.hasMeals);
                      const currentAndFutureDays = allDayEntries.filter(d => !d.dayIsPast);
                      const daysToRender = showPastDays ? allDayEntries : currentAndFutureDays;

                      return (
                        <>
                          {pastDaysWithMeals.length > 0 && !showPastDays && (
                            <button
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-sm text-muted-foreground hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                              onClick={() => setShowPastDays(true)}
                              data-testid="button-show-past-days"
                            >
                              <ChevronUp className="h-4 w-4" />
                              Show {pastDaysWithMeals.length} previous day{pastDaysWithMeals.length > 1 ? 's' : ''}
                            </button>
                          )}
                          {showPastDays && pastDaysWithMeals.length > 0 && (
                            <button
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-sm text-muted-foreground hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                              onClick={() => setShowPastDays(false)}
                              data-testid="button-hide-past-days"
                            >
                              <ChevronDown className="h-4 w-4" />
                              Hide previous days
                            </button>
                          )}
                          {daysToRender.map(({ dayDate, dayDateStr, dayMeals, dayIsPast, dayIsToday, dayIsFuture }) => {
                            const dayTotal = dayMeals.reduce((s, m) => s + m.calories, 0);
                            const daySelected = selectedMealIds[dayDateStr] || new Set<string>();
                            const unloggedMeals = dayMeals.filter(m => !loggedMealIds.has(m.id));
                            const allDayLogged = dayMeals.length > 0 && unloggedMeals.length === 0;
                            const allUnloggedSelected = unloggedMeals.length > 0 && unloggedMeals.every(m => daySelected.has(m.id));
                            const selectedCount = dayMeals.filter(m => daySelected.has(m.id)).length;
                            const selectedCalories = dayMeals.filter(m => daySelected.has(m.id)).reduce((s, m) => s + m.calories, 0);
                            const canLog = dayIsToday || dayIsPast;
                            return (
                              <div key={dayDateStr} className={`rounded-xl overflow-hidden border ${
                                dayIsToday ? 'border-primary/40 ring-1 ring-primary/20' :
                                dayIsPast ? 'border-slate-200/60 dark:border-slate-700/60' :
                                'border-slate-100 dark:border-slate-800'
                              }`}>
                                <div className={`px-4 py-3 ${
                                  dayIsToday ? 'bg-primary/10 dark:bg-primary/20' :
                                  dayIsPast ? 'bg-slate-100/70 dark:bg-slate-800/30' :
                                  'bg-slate-50 dark:bg-slate-800/50'
                                }`}>
                                  {dayIsToday && (
                                    <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full font-bold inline-block mb-1.5">TODAY</span>
                                  )}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-sm font-bold ${
                                        dayIsToday ? 'text-primary' :
                                        dayIsPast ? 'text-slate-400 dark:text-slate-500' :
                                        'text-slate-700 dark:text-slate-300'
                                      }`}>
                                        {format(dayDate, "EEEE")}
                                      </span>
                                      <span className={`text-xs ${dayIsPast ? 'text-slate-400 dark:text-slate-500' : 'text-muted-foreground'}`}>{format(dayDate, "MMM d")}</span>
                                      {allDayLogged && <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5"><Check className="h-3 w-3" /> Logged</span>}
                                      {dayIsFuture && dayMeals.length > 0 && <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-muted-foreground px-1.5 py-0.5 rounded-full font-medium">Upcoming</span>}
                                    </div>
                                    <span className={`text-xs font-semibold ${dayIsPast ? 'text-slate-400 dark:text-slate-500' : 'text-secondary'}`}>{dayTotal} kcal</span>
                                  </div>
                                </div>
                                <div className={`p-4 ${dayIsPast ? 'bg-slate-50/50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-900'}`}>
                                  {dayMeals.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-2">No meals planned</p>
                                  ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                      {dayMeals.map(meal => {
                                        const isLogged = loggedMealIds.has(meal.id);
                                        return (
                                          <div key={meal.id} className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                                            isLogged
                                              ? 'bg-primary/5 dark:bg-primary/10 border border-primary/15'
                                              : dayIsPast
                                              ? 'bg-slate-50 dark:bg-slate-800/50 border border-transparent opacity-75'
                                              : 'bg-slate-50 dark:bg-slate-800 border border-transparent'
                                          }`}
                                            data-testid={`planned-recipe-${meal.id}`}
                                          >
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                              dayIsFuture ? (
                                                meal.mealType === 'breakfast' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-400' :
                                                meal.mealType === 'lunch' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-400' :
                                                meal.mealType === 'dinner' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-400' :
                                                'bg-green-50 dark:bg-green-900/20 text-green-400'
                                              ) : (
                                                meal.mealType === 'breakfast' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                                                meal.mealType === 'lunch' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                                                meal.mealType === 'dinner' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                                                'bg-green-100 dark:bg-green-900/30 text-green-600'
                                              )
                                            }`}>
                                              {meal.mealType === 'breakfast' ? <Coffee className="h-3.5 w-3.5" /> :
                                               meal.mealType === 'lunch' ? <UtensilsCrossed className="h-3.5 w-3.5" /> :
                                               meal.mealType === 'dinner' ? <Utensils className="h-3.5 w-3.5" /> :
                                               <Cookie className="h-3.5 w-3.5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className={`text-xs font-medium truncate ${
                                                isLogged ? 'text-primary' :
                                                dayIsPast ? 'text-slate-400 dark:text-slate-500' :
                                                'text-slate-700 dark:text-slate-300'
                                              }`}>{meal.title}</p>
                                              <p className={`text-[10px] ${dayIsPast ? 'text-slate-400 dark:text-slate-500' : 'text-muted-foreground'}`}>{meal.calories} cal</p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                              <button
                                                className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                onClick={() => setSelectedRecipe({
                                                  ...meal,
                                                  type: meal.mealType,
                                                  match: meal.mealType,
                                                  cuisine: "planned",
                                                  image: null,
                                                })}
                                                data-testid={`button-view-planned-${meal.id}`}
                                              >
                                                <Eye className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                                              </button>
                                              {canLog && (
                                                <button
                                                  className={`p-1.5 rounded-md border transition-colors ${
                                                    isLogged
                                                      ? 'border-primary/30 bg-primary/10 cursor-default'
                                                      : 'border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10'
                                                  }`}
                                                  disabled={isLogged}
                                                  onClick={() => {
                                                    addRecipeToTracker(meal);
                                                    toast({
                                                      title: `Logged ${meal.title}`,
                                                      description: `${meal.calories} cal added to diary`,
                                                    });
                                                  }}
                                                  data-testid={`button-log-planned-${meal.id}`}
                                                >
                                                  {isLogged ? (
                                                    <Check className="h-3 w-3 text-primary" />
                                                  ) : (
                                                    <Plus className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                                                  )}
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      );
                    })()}
                  </div>
                </TabsContent>
              )}

              <TabsContent value="recommended" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                      <ChefHat className="h-5 w-5 text-secondary" />
                      Curated for your {targetCalories} kcal goal
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      These meals are perfectly portioned to help you maintain your {Math.round(dailyDifference)} kcal {isGainingWeight ? 'surplus' : 'deficit'}.
                    </p>
                  </div>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Meal Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Meals</SelectItem>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snacks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe) => (
                    <Card key={recipe.id} className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                          {recipe.match}
                        </div>
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-display font-semibold text-lg leading-tight line-clamp-2">{recipe.title}</h3>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Calories</span>
                            <span className="font-bold text-foreground">{recipe.calories}</span>
                          </div>
                          <div className="h-8 w-px bg-slate-100 dark:bg-slate-700"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Protein</span>
                            <span className="font-medium text-slate-600 dark:text-slate-400">{recipe.protein}</span>
                          </div>
                          <div className="h-8 w-px bg-slate-100 dark:bg-slate-700"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Time</span>
                            <span className="font-medium text-slate-600 dark:text-slate-400">{recipe.time}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-5 pt-0 flex gap-2">
                        <Button 
                          className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-foreground border border-slate-200 dark:border-slate-700" 
                          variant="outline"
                          onClick={() => setSelectedRecipe(recipe)}
                          data-testid={`button-view-recipe-${recipe.id}`}
                        >
                          View Recipe
                        </Button>
                        <Button 
                          className="bg-secondary hover:bg-secondary/90 text-white shrink-0" 
                          onClick={() => addRecipeToTracker(recipe)}
                        >
                          <Plus className="h-4 w-4 mr-1.5" /> Log
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden relative">
                  <div className="absolute -right-10 -top-10 text-blue-200 dark:text-slate-700 opacity-50">
                    <Wand2 className="h-48 w-48" />
                  </div>
                  <CardContent className="p-8 relative z-10">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-accent/20 rounded-xl mb-4">
                        <Wand2 className="h-6 w-6 text-accent" />
                      </div>
                      <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">Recipe Generator</h2>
                      <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Create a custom recipe tailored to {Math.round(targetCalories / 3)} calories per meal.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">Protein Source</Label>
                            <Select value={genProteinSource} onValueChange={setGenProteinSource}>
                              <SelectTrigger className="bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 shadow-sm" data-testid="select-protein-source">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="chicken">Chicken</SelectItem>
                                <SelectItem value="fish">Fish</SelectItem>
                                <SelectItem value="beef">Beef</SelectItem>
                                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">Meal Type</Label>
                            <Select value={genMealType} onValueChange={setGenMealType}>
                              <SelectTrigger className="bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 shadow-sm" data-testid="select-meal-type">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="breakfast">Breakfast</SelectItem>
                                <SelectItem value="lunch">Lunch</SelectItem>
                                <SelectItem value="dinner">Dinner</SelectItem>
                                <SelectItem value="snack">Snack</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">Servings</Label>
                            <Select value={String(genServings)} onValueChange={(v) => setGenServings(Number(v))}>
                              <SelectTrigger className="bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 shadow-sm" data-testid="select-servings">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="6">6</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">Optional Ingredients <span className="normal-case font-normal text-muted-foreground">(Add your own)</span></Label>
                          <Input 
                            placeholder="e.g. broccoli, rice, bell peppers..." 
                            className="h-12 bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 shadow-sm"
                            value={generatorIngredients}
                            onChange={(e) => setGeneratorIngredients(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateRecipe()}
                            data-testid="input-generator-ingredients"
                          />
                        </div>

                        <Button 
                          className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white h-12 px-8"
                          onClick={handleGenerateRecipe}
                          disabled={isGenerating}
                          data-testid="button-generate-recipe"
                        >
                          {isGenerating ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              Generating...
                            </span>
                          ) : (
                            "Generate Recipe"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {generatedRecipe && (
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-72 h-48 md:h-auto overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 flex items-center justify-center">
                        <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                          <span className="bg-accent/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                            {generatedRecipe.match}
                          </span>
                          {generatedRecipe.dietaryTag && generatedRecipe.dietaryTag !== "balanced" && (
                            <span className="bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm capitalize">
                              {generatedRecipe.dietaryTag}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-center gap-2 text-center px-4">
                          <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
                            <ChefHat className="h-8 w-8 text-primary" />
                          </div>
                          <p className="text-sm font-display font-bold text-slate-700 dark:text-slate-200">{profile?.name || "Your"}'s Custom Recipe</p>
                        </div>
                      </div>
                      <div className="flex-1 p-6 space-y-4">
                        <div>
                          <h3 className="font-display font-bold text-xl">{generatedRecipe.title}</h3>
                          <p className="text-sm text-muted-foreground capitalize mt-1">{generatedRecipe.type} · {generatedRecipe.time}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Calories</span>
                            <span className="font-bold text-foreground">{generatedRecipe.calories}</span>
                          </div>
                          <div className="h-8 w-px bg-slate-100 dark:bg-slate-700"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Protein</span>
                            <span className="font-medium text-blue-600">{generatedRecipe.protein}</span>
                          </div>
                          <div className="h-8 w-px bg-slate-100 dark:bg-slate-700"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Carbs</span>
                            <span className="font-medium text-emerald-600">{generatedRecipe.carbs}</span>
                          </div>
                          <div className="h-8 w-px bg-slate-100 dark:bg-slate-700"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Fat</span>
                            <span className="font-medium text-amber-600">{generatedRecipe.fat}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline"
                            className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-foreground border border-slate-200 dark:border-slate-700"
                            onClick={() => setSelectedRecipe(generatedRecipe)}
                            data-testid="button-view-generated-recipe"
                          >
                            View Recipe
                          </Button>
                          <Button 
                            className="bg-accent hover:bg-accent/90 text-white shrink-0"
                            onClick={() => addSavedRecipeMutation.mutate(generatedRecipe)}
                            disabled={addSavedRecipeMutation.isPending}
                            data-testid="button-add-to-my-recipes"
                          >
                            <Bookmark className="h-4 w-4 mr-1.5" /> Add to My Recipes
                          </Button>
                          <Button 
                            className="bg-secondary hover:bg-secondary/90 text-white shrink-0"
                            onClick={() => addRecipeToTracker(generatedRecipe)}
                          >
                            <Plus className="h-4 w-4 mr-1.5" /> Log
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {savedRecipesData.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                      <Bookmark className="h-5 w-5 text-accent" />
                      My Saved Recipes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedRecipesData.map((recipe) => (
                        <Card key={recipe.id} className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 flex items-center justify-center">
                            <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                              <span className="bg-accent/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm capitalize">
                                {recipe.type}
                              </span>
                              {(recipe as any).dietaryTag && (recipe as any).dietaryTag !== "balanced" && (
                                <span className="bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm capitalize">
                                  {(recipe as any).dietaryTag}
                                </span>
                              )}
                            </div>
                            <div className="absolute top-3 right-3 z-10">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500 rounded-full"
                                onClick={() => removeSavedRecipeMutation.mutate(recipe.id)}
                                data-testid={`button-remove-saved-${recipe.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center px-4">
                              <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                <ChefHat className="h-8 w-8 text-primary" />
                              </div>
                              <p className="text-sm font-display font-bold text-slate-700 dark:text-slate-200">{profile?.name || "Your"}'s Custom Recipe</p>
                            </div>
                          </div>
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-display font-semibold text-lg leading-tight line-clamp-2">{recipe.title}</h3>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Calories</span>
                                <span className="font-bold text-foreground">{recipe.calories}</span>
                              </div>
                              <div className="h-8 w-px bg-slate-100 dark:bg-slate-700"></div>
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Protein</span>
                                <span className="font-medium text-slate-600 dark:text-slate-400">{recipe.protein}</span>
                              </div>
                              <div className="h-8 w-px bg-slate-100 dark:bg-slate-700"></div>
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Time</span>
                                <span className="font-medium text-slate-600 dark:text-slate-400">{recipe.time}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-5 pt-0 flex gap-2">
                            <Button 
                              className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-foreground border border-slate-200 dark:border-slate-700" 
                              variant="outline"
                              onClick={() => setSelectedRecipe({
                                ...recipe,
                                match: recipe.type,
                                image: null,
                              })}
                              data-testid={`button-view-saved-${recipe.id}`}
                            >
                              View Recipe
                            </Button>
                            <Button 
                              className="bg-secondary hover:bg-secondary/90 text-white shrink-0" 
                              onClick={() => addRecipeToTracker({
                                ...recipe,
                                match: recipe.type,
                                image: null,
                              })}
                            >
                              <Plus className="h-4 w-4 mr-1.5" /> Log
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

            </Tabs>
          </div>
        </div>

        {/* Inline Profile Section - Mobile */}
        <div ref={profileSectionRef} className="sm:hidden space-y-4 pt-2">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
            <div className="h-2 bg-primary w-full"></div>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.avatarSeed || "Felix"}`}
                  alt="Avatar"
                  className="h-14 w-14 rounded-full bg-white border-2 border-primary/20 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-display font-bold text-slate-800 dark:text-slate-200">{profile?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{profile?.activityLevel ? profile.activityLevel.charAt(0).toUpperCase() + profile.activityLevel.slice(1) : "Moderate"} activity</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 gap-1.5"
                  onClick={() => setEditProfileOpen(true)}
                  data-testid="button-edit-profile-inline"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Starting</p>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{startingWeight ?? "—"} lbs</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Current</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentWeight ?? "—"} lbs</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Goal</p>
                  <p className="text-sm font-bold text-primary">{targetWeight ?? "—"} lbs</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Progress</p>
                  <span className="text-xs font-bold text-primary">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all" style={{ width: `${Math.min(100, progressPercentage)}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Daily Calories</p>
                  <p className="text-lg font-bold text-secondary">{targetCalories}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Timeframe</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{timeframe} <span className="text-xs font-normal text-muted-foreground">weeks</span></p>
                </div>
              </div>

              {profile?.targetDate && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <CalendarDays className="h-4 w-4 text-secondary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Target Date</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{format(new Date(profile.targetDate + "T00:00:00"), "MMMM d, yyyy")}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    {darkMode ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Switch appearance</p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={(checked) => {
                    setDarkMode(checked);
                    if (checked) {
                      document.documentElement.classList.add("dark");
                      localStorage.setItem("caloriezone-dark-mode", "true");
                    } else {
                      document.documentElement.classList.remove("dark");
                      localStorage.setItem("caloriezone-dark-mode", "false");
                    }
                  }}
                  data-testid="switch-dark-mode-inline"
                />
              </div>

            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={!!selectedRecipe} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
        {selectedRecipe && (
          <DialogContent className="max-w-md p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="relative h-56 overflow-hidden">
              {selectedRecipe.image ? (
                <img 
                  src={selectedRecipe.image} 
                  alt={selectedRecipe.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-center px-4">
                    <div className="w-20 h-20 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <ChefHat className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-base font-display font-bold text-slate-700 dark:text-slate-200">
                      {selectedRecipe.cuisine === "planned"
                        ? `${profile?.name || "Your"}'s Meal Plan`
                        : `${profile?.name || "Your"}'s Custom Recipe`}
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                {selectedRecipe.match}
              </div>
            </div>
            <div className="p-6 space-y-5">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{selectedRecipe.title}</DialogTitle>
                <DialogDescription className="capitalize">
                  {selectedRecipe.cuisine === "planned"
                    ? `${profile?.name || "Your"}'s Meal Plan`
                    : `${selectedRecipe.type} · ${selectedRecipe.cuisine === 'all' ? 'Balanced' : selectedRecipe.cuisine}`}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Calories</div>
                  <div className="font-bold text-lg text-foreground">{selectedRecipe.calories}</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/50 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Protein</div>
                  <div className="font-bold text-lg text-blue-600">{selectedRecipe.protein}</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/50 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Carbs</div>
                  <div className="font-bold text-lg text-emerald-600">{selectedRecipe.carbs}</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/50 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Fat</div>
                  <div className="font-bold text-lg text-amber-600">{selectedRecipe.fat}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Prep time: {selectedRecipe.time}</span>
              </div>

              {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-display font-semibold text-sm flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-primary" />
                    Ingredients
                    <span className="text-xs font-normal text-muted-foreground ml-auto">1 serving</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedRecipe.ingredients.map((ing: { item: string; amount: string; cal: number }, idx: number) => (
                      <li key={idx} className="flex items-center justify-between text-sm py-1 border-b border-slate-50 dark:border-slate-800 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0"></span>
                          <span className="text-slate-700 dark:text-slate-300">{ing.item}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-slate-400 dark:text-slate-500 text-xs">{ing.amount}</span>
                          {ing.cal > 0 && <span className="text-slate-400 text-xs w-12 text-right">{ing.cal} cal</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedRecipe.steps && selectedRecipe.steps.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-display font-semibold text-sm flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-secondary" />
                    Preparation Steps
                  </h4>
                  <ol className="space-y-2.5">
                    {selectedRecipe.steps.map((step: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-white"
                  onClick={() => {
                    addRecipeToTracker(selectedRecipe);
                    setSelectedRecipe(null);
                  }}
                  data-testid="button-log-from-dialog"
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Log This Meal
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={groceryListOpen} onOpenChange={setGroceryListOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 p-5 border-b border-slate-100 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="font-display text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Grocery List
              </DialogTitle>
              <DialogDescription>{profile?.name || "Your"}'s Meal Plan · {plannedMealsData.length} meals this week</DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {(() => {
              const list = aggregatedGroceryList();
              const categoryOrder = ["Proteins", "Dairy & Eggs", "Grains & Bread", "Fruits", "Vegetables", "Nuts & Seeds", "Pantry & Sauces", "Spices & Herbs", "Other"];
              const totalItems = Object.values(list).flat().length;
              const selectedCount = Object.values(groceryChecked).filter(Boolean).length;
              return (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{selectedCount} of {totalItems} items selected</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const all: Record<string, boolean> = {};
                          Object.values(list).flat().forEach(e => { all[e.item.toLowerCase().trim()] = true; });
                          setGroceryChecked(all);
                        }}
                        className="text-[10px] font-semibold text-primary hover:underline"
                        data-testid="grocery-select-all"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <button
                        onClick={() => setGroceryChecked({})}
                        className="text-[10px] font-semibold text-muted-foreground hover:underline"
                        data-testid="grocery-deselect-all"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                  {categoryOrder.map(cat => {
                    if (!list[cat] || list[cat].length === 0) return null;
                    return (
                      <div key={cat} className="space-y-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary/40"></span>
                          {cat}
                          <span className="text-[10px] font-normal text-muted-foreground ml-auto">{list[cat].length} items</span>
                        </h4>
                        <div className="space-y-0.5">
                          {list[cat].map(entry => {
                            const key = entry.item.toLowerCase().trim();
                            const isChecked = !!groceryChecked[key];
                            return (
                              <div key={key}>
                                <label
                                  className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${
                                    isChecked
                                      ? 'bg-primary/5 dark:bg-primary/10'
                                      : 'bg-slate-50 dark:bg-slate-800/50 opacity-60'
                                  }`}
                                  data-testid={`grocery-item-${key}`}
                                >
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(v) => setGroceryChecked(prev => ({ ...prev, [key]: !!v }))}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <span className={`text-sm font-medium ${isChecked ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 line-through'}`}>
                                      {entry.item}
                                    </span>
                                    {entry.originalNames && entry.originalNames.length > 1 && (
                                      <p className="text-[10px] text-muted-foreground mt-0.5">
                                        Includes: {entry.originalNames.join(", ")}
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {entry.amounts.length > 3
                                      ? `${entry.amounts.slice(0, 2).join(", ")} +${entry.amounts.length - 2} more`
                                      : entry.amounts.join(", ")}
                                  </span>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
              onClick={handleExportGroceryList}
              data-testid="button-export-grocery"
            >
              {groceryCopied ? (
                <><Check className="h-4 w-4 mr-1.5" /> Copied!</>
              ) : (
                <><Copy className="h-4 w-4 mr-1.5" /> Copy</>
              )}
            </Button>
            <Button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleShareGroceryList}
              data-testid="button-share-grocery"
            >
              <Share2 className="h-4 w-4 mr-1.5" /> Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <OnboardingDialog
        open={!!profile && !profile.name}
        onComplete={handleOnboardingComplete}
        initialStartingWeight={startingWeight}
        initialCurrentWeight={currentWeight}
        initialTargetWeight={targetWeight}
        initialTimeframe={timeframe}
        initialTargetDate={profile?.targetDate || undefined}
      />

      <OnboardingDialog
        open={editProfileOpen}
        onComplete={handleOnboardingComplete}
        onClose={() => setEditProfileOpen(false)}
        initialName={profile?.name || ""}
        initialAvatar={profile?.avatarSeed || "Felix"}
        initialStartingWeight={startingWeight}
        initialCurrentWeight={currentWeight}
        initialTargetWeight={targetWeight}
        initialTimeframe={timeframe}
        initialTargetDate={profile?.targetDate || undefined}
        initialActivityLevel={profile?.activityLevel || "moderate"}
        editMode
      />

      <Dialog open={exerciseDialogOpen} onOpenChange={setExerciseDialogOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <DialogHeader className="p-5 pb-3">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Dumbbell className="h-5 w-5 text-accent" />
              Add Exercise
            </DialogTitle>
            <DialogDescription className="text-sm">
              Log an exercise to earn extra calories (50% of calories burned)
            </DialogDescription>
          </DialogHeader>
          <div className="px-5 pb-5 space-y-4">
            {!selectedExercise ? (
              <>
                <Input
                  placeholder="Search exercises..."
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  className="h-9 text-sm"
                  data-testid="input-exercise-search"
                />
                <div className="grid grid-cols-2 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
                  {filteredExercises.map(ex => (
                    <button
                      key={ex.name}
                      onClick={() => { setSelectedExercise(ex); setExerciseDuration(30); }}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-accent hover:bg-accent/5 dark:hover:bg-accent/10 transition-all text-left"
                      data-testid={`exercise-option-${ex.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Dumbbell className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{ex.name}</p>
                        <p className="text-[10px] text-muted-foreground">~{ex.calPerMin} cal/min</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 dark:bg-accent/10 border border-accent/20">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                    <Dumbbell className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selectedExercise.name}</p>
                    <p className="text-xs text-muted-foreground">~{selectedExercise.calPerMin} cal/min</p>
                  </div>
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="ml-auto text-xs text-accent hover:text-accent/80 font-medium"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Duration (minutes)</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="range"
                      min={5}
                      max={120}
                      step={5}
                      value={exerciseDuration}
                      onChange={(e) => setExerciseDuration(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                      data-testid="slider-exercise-duration"
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-12 text-right">{exerciseDuration} min</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>5 min</span>
                    <span>2 hrs</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-center">
                    <p className="text-lg font-bold text-secondary">{Math.round(selectedExercise.calPerMin * exerciseDuration)}</p>
                    <p className="text-[10px] text-secondary/70 font-medium uppercase">Calories burned</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
                    <p className="text-lg font-bold text-primary">+{Math.round(selectedExercise.calPerMin * exerciseDuration * 0.5)}</p>
                    <p className="text-[10px] text-primary/70 font-medium uppercase">Calories earned</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-white"
                  onClick={() => {
                    const burned = Math.round(selectedExercise.calPerMin * exerciseDuration);
                    addExerciseMutation.mutate({
                      name: selectedExercise.name,
                      duration: exerciseDuration,
                      caloriesBurned: burned,
                    });
                    toast({
                      title: `Logged ${selectedExercise.name}`,
                      description: `${burned} cal burned · +${Math.round(burned * 0.5)} calories earned`,
                    });
                    setExerciseDialogOpen(false);
                  }}
                  data-testid="button-confirm-exercise"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Log Exercise
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 sm:hidden safe-bottom" data-testid="mobile-bottom-nav">
        <div className="flex justify-around items-center h-16 px-2">
          {[
            { id: "track" as const, icon: Activity, label: "Track" },
            { id: "plan" as const, icon: CalendarDays, label: "Plan" },
            { id: "scan" as const, icon: ScanLine, label: "AI Scan" },
            { id: "recipes" as const, icon: ChefHat, label: "Recipes" },
            { id: "profile" as const, icon: User, label: "Profile" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleMobileTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-lg transition-colors ${
                mobileTab === item.id
                  ? "text-primary"
                  : "text-slate-400 dark:text-slate-500"
              }`}
              data-testid={`mobile-nav-${item.id}`}
            >
              {item.id === "scan" ? (
                <div className="bg-primary text-white rounded-full p-2.5 -mt-5 shadow-lg shadow-primary/30">
                  <item.icon className="h-5 w-5" />
                </div>
              ) : (
                <item.icon className={`h-5 w-5 ${mobileTab === item.id ? "stroke-[2.5]" : ""}`} />
              )}
              <span className={`text-[10px] font-medium ${item.id === "scan" ? "mt-0.5" : ""}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}