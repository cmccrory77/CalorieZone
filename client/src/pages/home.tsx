import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Target, 
  Activity, 
  Flame, 
  Calendar,
  ChefHat,
  Wand2,
  CalendarDays,
  Plus,
  X,
  PieChart as PieChartIcon
} from "lucide-react";
import { format, addWeeks } from "date-fns";
import type { UserProfile, FoodEntry } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

import recipe1 from "@/assets/images/recipe-1.jpg";
import recipe2 from "@/assets/images/recipe-2.jpg";
import recipe3 from "@/assets/images/recipe-3.jpg";
import recipe4 from "@/assets/images/recipe-4.jpg";
import recipe5 from "@/assets/images/recipe-5.jpg";
import recipe6 from "@/assets/images/recipe-6.jpg";
import recipe7 from "@/assets/images/recipe-7.jpg";
import recipe8 from "@/assets/images/recipe-8.jpg";
import recipe9 from "@/assets/images/recipe-9.jpg";
import recipe10 from "@/assets/images/recipe-10.jpg";
import recipe11 from "@/assets/images/recipe-11.jpg";
import recipe12 from "@/assets/images/recipe-12.jpg";

export default function Home() {
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  const { data: foodEntries = [] } = useQuery<FoodEntry[]>({
    queryKey: ["/api/food-entries", profile?.id, today],
    enabled: !!profile?.id,
    queryFn: async () => {
      const res = await fetch(`/api/food-entries/${profile!.id}/${today}`);
      if (!res.ok) throw new Error("Failed to load food entries");
      return res.json();
    },
  });

  const [startingWeight, setStartingWeight] = useState(185);
  const [currentWeight, setCurrentWeight] = useState(185);
  const [targetWeight, setTargetWeight] = useState(165);
  const [timeframe, setTimeframe] = useState(12);
  const [targetDate, setTargetDate] = useState<Date>(addWeeks(new Date(), 12));
  const [mealType, setMealType] = useState("all");
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodCalories, setNewFoodCalories] = useState("");
  const [newFoodProtein, setNewFoodProtein] = useState("");
  const [newFoodCarbs, setNewFoodCarbs] = useState("");
  const [newFoodFat, setNewFoodFat] = useState("");

  const profileSynced = useRef(false);
  useEffect(() => {
    if (profile && !profileSynced.current) {
      setStartingWeight(profile.startingWeight);
      setCurrentWeight(profile.currentWeight);
      setTargetWeight(profile.targetWeight);
      setTimeframe(profile.timeframe);
      setTargetDate(addWeeks(new Date(), profile.timeframe));
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

  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const saveProfile = useCallback(
    (data: Partial<UserProfile>) => {
      if (!profile?.id) return;
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        updateProfileMutation.mutate(data);
      }, 500);
    },
    [profile?.id]
  );

  const addFoodMutation = useMutation({
    mutationFn: async (entry: { name: string; calories: number; protein: number; carbs: number; fat: number }) => {
      const res = await apiRequest("POST", "/api/food-entries", {
        profileId: profile!.id,
        date: today,
        ...entry,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries"] });
    },
  });

  const removeFoodMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/food-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-entries"] });
    },
  });

  const trackedFoods = foodEntries;

  const handleAddFood = () => {
    if (newFoodName && newFoodCalories) {
      const cals = parseInt(newFoodCalories);
      const prot = newFoodProtein ? parseInt(newFoodProtein) : Math.round(cals * 0.3 / 4);
      const carb = newFoodCarbs ? parseInt(newFoodCarbs) : Math.round(cals * 0.4 / 4);
      const fat = newFoodFat ? parseInt(newFoodFat) : Math.round(cals * 0.3 / 9);

      addFoodMutation.mutate({ name: newFoodName, calories: cals, protein: prot, carbs: carb, fat: fat });
      setNewFoodName("");
      setNewFoodCalories("");
      setNewFoodProtein("");
      setNewFoodCarbs("");
      setNewFoodFat("");
    }
  };

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

  const handleStartingWeightChange = (val: number) => {
    setStartingWeight(val);
    saveProfile({ startingWeight: val });
  };
  const handleCurrentWeightChange = (val: number) => {
    setCurrentWeight(val);
    saveProfile({ currentWeight: val });
  };
  const handleTargetWeightChange = (val: number) => {
    setTargetWeight(val);
    saveProfile({ targetWeight: val });
  };

  const handleTimeframeChange = (weeks: number) => {
    setTimeframe(weeks);
    setTargetDate(addWeeks(new Date(), weeks));
    saveProfile({ timeframe: weeks });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setTargetDate(date);
      const diffTime = Math.abs(date.getTime() - new Date().getTime());
      const diffWeeks = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24 * 7)));
      const capped = Math.min(52, diffWeeks);
      setTimeframe(capped);
      saveProfile({ timeframe: capped });
    }
  };

  const maintenanceCalories = profile?.maintenanceCalories ?? 2450;
  const isGainingWeight = targetWeight > startingWeight;
  const weeklyLossGoal = Math.abs(currentWeight - targetWeight) / timeframe;
  const dailyDifference = weeklyLossGoal * 500; // rough estimate 500 cal difference = 1 lb/week
  
  // If gaining weight, add the surplus. If losing, subtract the deficit.
  const targetCalories = isGainingWeight 
    ? Math.round(maintenanceCalories + dailyDifference)
    : Math.round(maintenanceCalories - dailyDifference);
  
  const totalWeightDifference = Math.abs(startingWeight - targetWeight);
  const weightChangedSoFar = Math.abs(startingWeight - currentWeight);
  const progressPercentage = totalWeightDifference > 0 
    ? Math.max(0, Math.min(100, (weightChangedSoFar / totalWeightDifference) * 100)) 
    : 0;

  // Macro Calculations
  const totalProtein = trackedFoods.reduce((acc, food) => acc + (food.protein || 0), 0);
  const totalCarbs = trackedFoods.reduce((acc, food) => acc + (food.carbs || 0), 0);
  const totalFat = trackedFoods.reduce((acc, food) => acc + (food.fat || 0), 0);
  
  const hasMacros = totalProtein > 0 || totalCarbs > 0 || totalFat > 0;
  const macroData = hasMacros ? [
    { name: 'Protein', value: totalProtein, color: '#3b82f6' }, // blue-500
    { name: 'Carbs', value: totalCarbs, color: '#10b981' },   // emerald-500
    { name: 'Fat', value: totalFat, color: '#f59e0b' }        // amber-500
  ] : [
    { name: 'No Data', value: 1, color: '#f1f5f9' }           // slate-100
  ];

  const targetProtein = Math.round((targetCalories * 0.3) / 4);
  const targetCarbs = Math.round((targetCalories * 0.4) / 4);
  const targetFat = Math.round((targetCalories * 0.3) / 9);

  const getDailyRecipes = () => {
    const dayOfWeek = new Date().getDay(); // 0 to 6
    const cuisines = ["all", "vegetarian", "italian", "mediterranean", "asian", "mexican", "american"];
    const categories = ["breakfast", "lunch", "dinner", "snack"];
    const images = [recipe1, recipe2, recipe3, recipe4, recipe5, recipe6, recipe7, recipe8, recipe9, recipe10, recipe11, recipe12];
    
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
      breakfast: ["Oatmeal", "Scramble", "Toast", "Bowl", "Pancakes", "Parfait", "Smoothie", "Muffins"],
      lunch: ["Wrap", "Salad", "Bowl", "Sandwich", "Bento", "Plate", "Pita", "Melt"],
      dinner: ["Skillet", "Roast", "Bake", "Stir-fry", "Grill", "Stew", "Casserole", "Platter"],
      snack: ["Bites", "Sticks", "Mix", "Dip", "Chips", "Crunch", "Bite", "Energy"]
    };

    const proteins = ["Chicken", "Tofu", "Salmon", "Turkey", "Beef", "Chickpeas", "Egg", "Tempeh", "Black Beans", "Lentils"];
    
    const generatedRecipes: any[] = [];
    let idCounter = 1;

    cuisines.forEach((c) => {
      const keywords = cuisineKeywords[c] || cuisineKeywords.all;
      categories.forEach((cat) => {
        const nouns = mealNouns[cat];
        
        for (let i = 0; i < 3; i++) {
          // Create a deterministic seed based on day, cuisine, category, and index
          // We mix the string hash of cuisine + category so the sequences don't just shift
          let strHash = 0;
          const comboStr = c + cat;
          for(let k=0; k<comboStr.length; k++) {
            strHash = ((strHash << 5) - strHash) + comboStr.charCodeAt(k);
            strHash |= 0;
          }
          
          const seed = Math.abs(dayOfWeek * 10000 + strHash * 10 + i);
          
          const keyword = keywords[seed % keywords.length];
          const protein = proteins[(seed * 3) % proteins.length];
          const noun = nouns[(seed * 5) % nouns.length];
          
          let title = `${keyword} ${protein} ${noun}`;
          if (cat === 'snack') {
            title = seed % 2 === 0 ? `${keyword} Energy ${noun}` : `${keyword} Hummus & ${noun}`;
          } else if (cat === 'breakfast') {
            title = seed % 2 === 0 ? `${keyword} ${noun} with Berries` : `${protein} & ${keyword} ${noun}`;
          }

          // Distribute images nicely
          let imgOffset = 0;
          if (cat === 'breakfast') imgOffset = 1; // starts at recipe2
          if (cat === 'dinner') imgOffset = 4;
          if (cat === 'snack') imgOffset = 10;
          
          const imgIdx = (imgOffset + (seed % 5)) % images.length;
          
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
            image: images[imgIdx],
            match: `${85 + ((seed * 23) % 15)}% Match`
          });
        }
      });
    });

    return generatedRecipes;
  };

  const allRecipes = getDailyRecipes();

  const dailyPlanRecipes = allRecipes.filter(r => r.cuisine === 'all');
  const recipes = mealType === "all" ? dailyPlanRecipes : dailyPlanRecipes.filter(r => r.type === mealType);

  return (
    <div className="min-h-screen bg-green-50/40">
      {/* Navigation */}
      <nav className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 text-primary">
              <Activity className="h-6 w-6" />
              <span className="font-display font-bold text-xl tracking-tight">Caloriq</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground mr-4">
                <span className="font-medium text-foreground">{targetCalories}</span>
                <span>kcal daily goal</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`} alt="User avatar" className="h-8 w-8 rounded-full bg-muted" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, Alex</h1>
          <p className="text-muted-foreground mt-1">Here's your progress and personalized plan for today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Top Row - Cards (Left & Right) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Weight Goal Card */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <div className="h-2 bg-primary w-full"></div>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  Weight Goal
                </CardTitle>
                <CardDescription>Adjust your metrics to recalculate your plan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2 min-w-0">
                      <Label htmlFor="starting-weight" className="text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">Starting (lbs)</Label>
                      <Input 
                        id="starting-weight" 
                        type="number" 
                        value={startingWeight} 
                        onChange={(e) => handleStartingWeightChange(Number(e.target.value))}
                        className="font-display font-semibold text-lg bg-slate-50 border-slate-200"
                        data-testid="input-starting-weight"
                      />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <Label htmlFor="target-weight" className="text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">Target (lbs)</Label>
                      <Input 
                        id="target-weight" 
                        type="number" 
                        value={targetWeight} 
                        onChange={(e) => handleTargetWeightChange(Number(e.target.value))}
                        className="font-display font-semibold text-lg bg-slate-50 border-slate-200"
                        data-testid="input-target-weight"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current-weight" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Current (lbs)</Label>
                    <Input 
                      id="current-weight" 
                      type="number" 
                      value={currentWeight} 
                      onChange={(e) => handleCurrentWeightChange(Number(e.target.value))}
                      className="font-display font-semibold text-lg bg-slate-50 border-slate-200"
                      data-testid="input-current-weight"
                    />
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="timeframe" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Timeframe (Weeks)</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-secondary">{timeframe} weeks</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-100">
                              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <CalendarComponent
                              mode="single"
                              selected={targetDate}
                              onSelect={handleDateChange}
                              disabled={(date) => date < new Date() || date > addWeeks(new Date(), 52)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="52" 
                      value={timeframe} 
                      onChange={(e) => handleTimeframeChange(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-secondary"
                      data-testid="slider-timeframe"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Aggressive</span>
                      <span>Steady</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Progress</span>
                    <span className="font-bold text-primary">
                      {weightChangedSoFar} lbs {isGainingWeight ? 'gained' : 'lost'}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-slate-100" />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {Math.abs(currentWeight - targetWeight)} lbs {isGainingWeight ? 'more to gain' : 'remaining to reach your goal'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-8">
            {/* Calories Tracker Card */}
            <Card className="border-none shadow-sm bg-white overflow-hidden relative h-full flex flex-col">
              <div className="h-2 bg-secondary w-full"></div>
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <Flame className="h-32 w-32 text-secondary" />
              </div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-slate-900 flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-secondary" />
                  Daily Targets & Tracker
                </CardTitle>
                <CardDescription>Log your meals to hit your daily goal.</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 flex-1 flex flex-col space-y-6">
                
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="text-4xl font-display font-bold text-slate-900 tracking-tight">
                      {trackedFoods.reduce((acc, food) => acc + food.calories, 0)}
                    </div>
                    <div className="text-slate-500 text-xs uppercase tracking-wide font-medium mt-1">Consumed</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold text-slate-400 tracking-tight">
                      {targetCalories}
                    </div>
                    <div className="text-slate-500 text-xs uppercase tracking-wide font-medium mt-1">Target</div>
                  </div>
                </div>

                <Progress 
                  value={Math.min(100, (trackedFoods.reduce((acc, food) => acc + food.calories, 0) / targetCalories) * 100)} 
                  className="h-3 bg-slate-100" 
                  indicatorClassName={trackedFoods.reduce((acc, food) => acc + food.calories, 0) > targetCalories ? "bg-red-500" : "bg-secondary"}
                />

                <div className="text-center text-sm font-medium pt-2 pb-4 border-b border-slate-100">
                  {targetCalories - trackedFoods.reduce((acc, food) => acc + food.calories, 0) > 0 ? (
                    <span className="text-secondary">{targetCalories - trackedFoods.reduce((acc, food) => acc + food.calories, 0)} calories remaining</span>
                  ) : (
                    <span className="text-red-500">Over goal by {Math.abs(targetCalories - trackedFoods.reduce((acc, food) => acc + food.calories, 0))} calories</span>
                  )}
                </div>

                {/* Add Custom Food */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-700">Quick Add</h4>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Food name" 
                      value={newFoodName}
                      onChange={(e) => setNewFoodName(e.target.value)}
                      className="flex-1 bg-slate-50 border-slate-200 text-sm h-9"
                    />
                    <Input 
                      type="number"
                      placeholder="Kcal" 
                      value={newFoodCalories}
                      onChange={(e) => setNewFoodCalories(e.target.value)}
                      className="w-20 bg-slate-50 border-slate-200 text-sm h-9"
                    />
                    <Button size="icon" onClick={handleAddFood} className="h-9 w-9 bg-secondary hover:bg-secondary/90 text-white shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Logged Foods List */}
                {trackedFoods.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-700">Today's Log</h4>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {trackedFoods.map(food => (
                        <div key={food.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 group transition-colors">
                          <span className="text-sm font-medium text-slate-700 truncate pr-2">{food.name}</span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm text-slate-500 font-semibold">{food.calories} kcal</span>
                            <button 
                              onClick={() => handleRemoveFood(food.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-auto">
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Maintenance</div>
                    <div className="font-semibold text-slate-700">{maintenanceCalories} kcal</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                      {isGainingWeight ? 'Daily Surplus' : 'Daily Deficit'}
                    </div>
                    <div className="font-semibold text-secondary">
                      {isGainingWeight ? '+' : '-'}{Math.round(dailyDifference)} kcal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <Card className="border-none shadow-sm bg-white overflow-hidden h-full flex flex-col">
              <div className="h-2 bg-accent w-full"></div>
              <CardHeader className="pb-0">
                <CardTitle className="text-slate-900 flex items-center gap-2 text-lg">
                  <PieChartIcon className="h-5 w-5 text-accent" />
                  Macros
                </CardTitle>
                <CardDescription>Daily macronutrient breakdown</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between pt-4">
                <div className="h-[180px] w-full relative">
                  {!hasMacros && (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400 z-10 pointer-events-none">
                      No macros logged yet
                    </div>
                  )}
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}g`, '']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-100 mt-4">
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Protein</div>
                    </div>
                    <div className="font-semibold text-sm">{totalProtein}g</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{targetProtein}g max</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Carbs</div>
                    </div>
                    <div className="font-semibold text-sm">{totalCarbs}g</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{targetCarbs}g max</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Fat</div>
                    </div>
                    <div className="font-semibold text-sm">{totalFat}g</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{targetFat}g max</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recipes & Meals */}
          <div className="lg:col-span-12 space-y-6">
            
            <Tabs defaultValue="recommended" className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <TabsList className="bg-white p-1 border border-slate-100 shadow-sm rounded-xl">
                  <TabsTrigger value="recommended" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                    Recommended
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white transition-all">
                    <Wand2 className="h-3.5 w-3.5 mr-2" />
                    Recipe Generator
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                  <Calendar className="h-4 w-4" />
                  Today's Plan
                </div>
              </div>

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
                    <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-200">
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
                    <Card key={recipe.id} className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
                          <div className="h-8 w-px bg-slate-100"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Protein</span>
                            <span className="font-medium text-slate-600">{recipe.protein}</span>
                          </div>
                          <div className="h-8 w-px bg-slate-100"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Time</span>
                            <span className="font-medium text-slate-600">{recipe.time}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-5 pt-0 flex gap-2">
                        <Button className="flex-1 bg-slate-50 hover:bg-slate-100 text-foreground border border-slate-200" variant="outline">
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

              <TabsContent value="ai" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 overflow-hidden relative">
                  <div className="absolute -right-10 -top-10 text-blue-200 opacity-50">
                    <Wand2 className="h-48 w-48" />
                  </div>
                  <CardContent className="p-8 relative z-10">
                    <div className="max-w-xl">
                      <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-xl mb-4">
                        <Wand2 className="h-6 w-6 text-accent" />
                      </div>
                      <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">Recipe Generator</h2>
                      <p className="text-slate-600 mb-6">
                        Tell us what ingredients you have in your fridge, and we'll generate a custom recipe tailored to exactly {Math.round(targetCalories / 3)} calories (your target per meal).
                      </p>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold">What ingredients do you have?</Label>
                          <Input 
                            placeholder="e.g. Chicken breast, broccoli, rice..." 
                            className="h-12 bg-white border-blue-200 shadow-sm"
                          />
                        </div>
                        <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white h-12 px-8">
                          Generate Recipe
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}