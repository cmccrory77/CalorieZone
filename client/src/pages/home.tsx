import { useState } from "react";
import { 
  Target, 
  Activity, 
  Flame, 
  UtensilsCrossed, 
  TrendingDown,
  Calendar,
  ChefHat,
  Search,
  Wand2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [currentWeight, setCurrentWeight] = useState(185);
  const [targetWeight, setTargetWeight] = useState(165);
  const [timeframe, setTimeframe] = useState(12); // weeks
  const [mealType, setMealType] = useState("all");
  const [hasSearched, setHasSearched] = useState(false);
  
  // Mock calculations
  const maintenanceCalories = 2450;
  const weeklyLossGoal = (currentWeight - targetWeight) / timeframe;
  const dailyDeficit = weeklyLossGoal * 500; // rough estimate 500 cal deficit = 1 lb/week
  const targetCalories = Math.round(maintenanceCalories - dailyDeficit);
  
  const progressPercentage = 35; // mock progress

  const allRecipes = [
    // Breakfast
    {
      id: 2,
      title: "Berry & Nut Power Oatmeal",
      type: "breakfast",
      calories: 380,
      protein: "15g",
      carbs: "52g",
      fat: "12g",
      time: "10 min",
      image: recipe2,
      match: "94% Match"
    },
    {
      id: 6,
      title: "Avocado Toast with Poached Egg",
      type: "breakfast",
      calories: 420,
      protein: "18g",
      carbs: "35g",
      fat: "22g",
      time: "12 min",
      image: recipe6,
      match: "96% Match"
    },
    {
      id: 7,
      title: "Greek Yogurt Parfait",
      type: "breakfast",
      calories: 310,
      protein: "22g",
      carbs: "38g",
      fat: "8g",
      time: "5 min",
      image: recipe7,
      match: "98% Match"
    },
    // Lunch
    {
      id: 1,
      title: "Grilled Lemon Herb Chicken Bowl",
      type: "lunch",
      calories: 450,
      protein: "42g",
      carbs: "35g",
      fat: "14g",
      time: "25 min",
      image: recipe1,
      match: "98% Match"
    },
    {
      id: 8,
      title: "Mediterranean Quinoa Salad",
      type: "lunch",
      calories: 410,
      protein: "16g",
      carbs: "48g",
      fat: "18g",
      time: "15 min",
      image: recipe8,
      match: "95% Match"
    },
    {
      id: 9,
      title: "Turkey & Spinach Wrap",
      type: "lunch",
      calories: 390,
      protein: "32g",
      carbs: "36g",
      fat: "14g",
      time: "10 min",
      image: recipe9,
      match: "92% Match"
    },
    // Dinner
    {
      id: 3,
      title: "Roasted Salmon with Sweet Potato",
      type: "dinner",
      calories: 520,
      protein: "38g",
      carbs: "40g",
      fat: "22g",
      time: "35 min",
      image: recipe3,
      match: "89% Match"
    },
    {
      id: 5,
      title: "Lean Steak and Asparagus",
      type: "dinner",
      calories: 490,
      protein: "45g",
      carbs: "12g",
      fat: "28g",
      time: "20 min",
      image: recipe5,
      match: "92% Match"
    },
    {
      id: 10,
      title: "Baked Cod with Quinoa",
      type: "dinner",
      calories: 440,
      protein: "36g",
      carbs: "42g",
      fat: "12g",
      time: "25 min",
      image: recipe10,
      match: "97% Match"
    },
    // Snacks
    {
      id: 4,
      title: "Hummus and Carrot Sticks",
      type: "snack",
      calories: 210,
      protein: "8g",
      carbs: "22g",
      fat: "10g",
      time: "5 min",
      image: recipe4,
      match: "99% Match"
    },
    {
      id: 11,
      title: "Apple Slices with Peanut Butter",
      type: "snack",
      calories: 240,
      protein: "7g",
      carbs: "28g",
      fat: "14g",
      time: "5 min",
      image: recipe11,
      match: "94% Match"
    },
    {
      id: 12,
      title: "Mixed Nuts Bowl",
      type: "snack",
      calories: 280,
      protein: "9g",
      carbs: "12g",
      fat: "24g",
      time: "2 min",
      image: recipe12,
      match: "91% Match"
    }
  ];

  const recipes = mealType === "all" ? allRecipes : allRecipes.filter(r => r.type === mealType);

  return (
    <div className="min-h-screen bg-background">
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
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="timeframe" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Timeframe (Weeks)</Label>
                      <span className="text-sm font-medium text-secondary">{timeframe} weeks</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="52" 
                      value={timeframe} 
                      onChange={(e) => setTimeframe(Number(e.target.value))}
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
                    <span className="font-bold text-primary">{Math.abs(currentWeight - 200)} lbs lost</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-slate-100" />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {Math.abs(currentWeight - targetWeight)} lbs remaining to reach your goal
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Calories Card */}
            <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Flame className="h-32 w-32" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-slate-100 flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-accent" />
                  Daily Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                <div>
                  <div className="text-5xl font-display font-bold text-white tracking-tight">{targetCalories}</div>
                  <div className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-wide">Kcal / Day</div>
                </div>
                
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
                  <TabsTrigger value="search" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                    Search Recipes
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white transition-all">
                    <Wand2 className="h-3.5 w-3.5 mr-2" />
                    AI Generator
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
                      <CardFooter className="p-5 pt-0">
                        <Button className="w-full bg-slate-50 hover:bg-slate-100 text-foreground border border-slate-200" variant="outline">
                          View Recipe
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="search" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="border-none shadow-sm bg-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                      <div className="relative flex-1 flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input 
                            placeholder="Search for ingredients, cuisines..." 
                            className="pl-10 h-12 bg-slate-50 border-slate-200 text-base"
                          />
                        </div>
                        <Button className="h-12 px-6 bg-primary hover:bg-primary/90" onClick={() => setHasSearched(true)}>Go</Button>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-full md:w-[180px] h-12 bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Cuisine Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Cuisines</SelectItem>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="italian">Italian</SelectItem>
                            <SelectItem value="mediterranean">Mediterranean</SelectItem>
                            <SelectItem value="asian">Asian</SelectItem>
                            <SelectItem value="mexican">Mexican</SelectItem>
                            <SelectItem value="american">American</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button className="h-12 px-6 bg-primary hover:bg-primary/90" onClick={() => setHasSearched(true)}>Go</Button>
                      </div>
                    </div>

                    {!hasSearched ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <UtensilsCrossed className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-lg font-medium text-slate-600">Search for healthy recipes</p>
                        <p className="text-sm max-w-sm mt-2">Find meals that fit your {targetCalories} kcal daily goal. All recipes can be adjusted for your specific portion sizes.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allRecipes.slice(0, 6).map((recipe) => (
                          <Card key={`search-${recipe.id}`} className="border-none shadow-sm bg-slate-50 overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <div className="relative h-40 overflow-hidden">
                              <img 
                                src={recipe.image} 
                                alt={recipe.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-display font-semibold text-base leading-tight mb-3 line-clamp-1">{recipe.title}</h3>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-bold text-foreground">{recipe.calories} kcal</span>
                                <span className="text-muted-foreground">{recipe.time}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
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
                      <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">AI Recipe Generator</h2>
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