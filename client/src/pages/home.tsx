import { useState } from "react";
import { 
  Target, 
  Activity, 
  Flame, 
  UtensilsCrossed, 
  TrendingDown,
  Calendar,
  ChefHat,
  Wand2,
  CalendarDays,
  Plus,
  X
} from "lucide-react";
import { format, addWeeks } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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
  const [startingWeight, setStartingWeight] = useState(185);
  const [currentWeight, setCurrentWeight] = useState(185);
  const [targetWeight, setTargetWeight] = useState(165);
  const [timeframe, setTimeframe] = useState(12); // weeks
  const [targetDate, setTargetDate] = useState<Date>(addWeeks(new Date(), 12));
  const [mealType, setMealType] = useState("all");
  
  // Calorie Tracker State
  const [trackedFoods, setTrackedFoods] = useState<{id: number, name: string, calories: number}[]>([]);
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodCalories, setNewFoodCalories] = useState("");
  
  const handleAddFood = () => {
    if (newFoodName && newFoodCalories) {
      setTrackedFoods([
        ...trackedFoods, 
        { 
          id: Date.now(), 
          name: newFoodName, 
          calories: parseInt(newFoodCalories) 
        }
      ]);
      setNewFoodName("");
      setNewFoodCalories("");
    }
  };

  const handleRemoveFood = (id: number) => {
    setTrackedFoods(trackedFoods.filter(food => food.id !== id));
  };
  
  const addRecipeToTracker = (recipe: any) => {
    setTrackedFoods([
      ...trackedFoods,
      {
        id: Date.now(),
        name: recipe.title,
        calories: recipe.calories
      }
    ]);
  };

  // Handle timeframe change (updates date)
  const handleTimeframeChange = (weeks: number) => {
    setTimeframe(weeks);
    setTargetDate(addWeeks(new Date(), weeks));
  };

  // Handle date change (updates timeframe)
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setTargetDate(date);
      const diffTime = Math.abs(date.getTime() - new Date().getTime());
      const diffWeeks = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24 * 7)));
      setTimeframe(Math.min(52, diffWeeks)); // Cap at 52 weeks
    }
  };

  // Mock calculations
  const maintenanceCalories = 2450;
  const weeklyLossGoal = (currentWeight - targetWeight) / timeframe;
  const dailyDeficit = weeklyLossGoal * 500; // rough estimate 500 cal deficit = 1 lb/week
  const targetCalories = Math.round(maintenanceCalories - dailyDeficit);
  
  const totalWeightToLose = startingWeight - targetWeight;
  const weightLostSoFar = startingWeight - currentWeight;
  const progressPercentage = totalWeightToLose > 0 ? Math.max(0, Math.min(100, (weightLostSoFar / totalWeightToLose) * 100)) : 0;

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
    
    const generatedRecipes = [];
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

  const handleSearch = (cuisineType = selectedCuisine, query = searchQuery) => {
    let filtered = [...allRecipes];
    
    // Handle "all" cuisine logic
    if (cuisineType === "all" || cuisineType === "placeholder") {
      filtered = filtered.filter(r => r.cuisine === "all");
    } else {
      filtered = filtered.filter(r => r.cuisine === cuisineType);
    }
    
    // Text search logic
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(lowerQuery) || 
        r.cuisine.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Make sure we limit to 6 distinct recipes for the search tab
    setSearchResults(filtered.slice(0, 6));
    setHasSearched(true);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const executeTextSearch = () => {
    handleSearch(selectedCuisine, searchQuery);
  };

  const handleCuisineSelect = (val: string) => {
    if (val !== "placeholder") {
      setSelectedCuisine(val);
      handleSearch(val, searchQuery);
    }
  };

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
          
          {/* Left Column - Metrics & Calculator */}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="starting-weight" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Starting (lbs)</Label>
                      <Input 
                        id="starting-weight" 
                        type="number" 
                        value={startingWeight} 
                        onChange={(e) => setStartingWeight(Number(e.target.value))}
                        className="font-display font-semibold text-lg bg-slate-50 border-slate-200"
                        data-testid="input-starting-weight"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-weight" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Target (lbs)</Label>
                      <Input 
                        id="target-weight" 
                        type="number" 
                        value={targetWeight} 
                        onChange={(e) => setTargetWeight(Number(e.target.value))}
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
                      onChange={(e) => setCurrentWeight(Number(e.target.value))}
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
                    <span className="font-bold text-primary">{Math.abs(startingWeight - currentWeight)} lbs lost</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-slate-100" />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {Math.abs(currentWeight - targetWeight)} lbs remaining to reach your goal
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Calories Tracker Card */}
            <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Flame className="h-32 w-32" />
              </div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-slate-100 flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-accent" />
                  Daily Targets & Tracker
                </CardTitle>
                <CardDescription className="text-slate-400">Log your meals to hit your daily goal.</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="text-4xl font-display font-bold text-white tracking-tight">
                      {trackedFoods.reduce((acc, food) => acc + food.calories, 0)}
                    </div>
                    <div className="text-slate-400 text-xs uppercase tracking-wide font-medium mt-1">Consumed</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold text-slate-500 tracking-tight">
                      {targetCalories}
                    </div>
                    <div className="text-slate-500 text-xs uppercase tracking-wide font-medium mt-1">Target</div>
                  </div>
                </div>

                <Progress 
                  value={Math.min(100, (trackedFoods.reduce((acc, food) => acc + food.calories, 0) / targetCalories) * 100)} 
                  className="h-3 bg-slate-800" 
                  indicatorClassName={trackedFoods.reduce((acc, food) => acc + food.calories, 0) > targetCalories ? "bg-red-500" : "bg-accent"}
                />

                <div className="text-center text-sm font-medium pt-2 pb-4 border-b border-slate-800">
                  {targetCalories - trackedFoods.reduce((acc, food) => acc + food.calories, 0) > 0 ? (
                    <span className="text-accent">{targetCalories - trackedFoods.reduce((acc, food) => acc + food.calories, 0)} calories remaining</span>
                  ) : (
                    <span className="text-red-400">Over goal by {Math.abs(targetCalories - trackedFoods.reduce((acc, food) => acc + food.calories, 0))} calories</span>
                  )}
                </div>

                {/* Add Custom Food */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-300">Quick Add</h4>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Food name" 
                      value={newFoodName}
                      onChange={(e) => setNewFoodName(e.target.value)}
                      className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-sm h-9"
                    />
                    <Input 
                      type="number"
                      placeholder="Kcal" 
                      value={newFoodCalories}
                      onChange={(e) => setNewFoodCalories(e.target.value)}
                      className="w-20 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-sm h-9"
                    />
                    <Button size="icon" onClick={handleAddFood} className="h-9 w-9 bg-accent hover:bg-accent/90 text-white shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Logged Foods List */}
                {trackedFoods.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-300">Today's Log</h4>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {trackedFoods.map(food => (
                        <div key={food.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 group transition-colors">
                          <span className="text-sm font-medium text-slate-200 truncate pr-2">{food.name}</span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm text-slate-400 font-semibold">{food.calories} kcal</span>
                            <button 
                              onClick={() => handleRemoveFood(food.id)}
                              className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Maintenance</div>
                    <div className="font-semibold text-slate-200">{maintenanceCalories} kcal</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Daily Deficit</div>
                    <div className="font-semibold text-accent">-{Math.round(dailyDeficit)} kcal</div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Recipes & Meals */}
          <div className="lg:col-span-8 space-y-6">
            
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
                      These meals are perfectly portioned to help you maintain your {Math.round(dailyDeficit)} kcal deficit.
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