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
  PieChart as PieChartIcon,
  Clock,
  Utensils
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import BarcodeScanner from "@/components/BarcodeScanner";
import MealScanner from "@/components/MealScanner";
import FoodSearch from "@/components/FoodSearch";

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
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [generatorIngredients, setGeneratorIngredients] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateRecipe = () => {
    if (!generatorIngredients.trim()) return;
    setIsGenerating(true);
    setGeneratedRecipe(null);

    setTimeout(() => {
      const userIngredients = generatorIngredients.split(',').map(s => s.trim()).filter(Boolean);
      const mealCal = Math.round(targetCalories / 3);
      const categories = ["lunch", "dinner"];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const nouns: Record<string, string[]> = {
        lunch: ["Bowl", "Salad", "Wrap"],
        dinner: ["Skillet", "Stir-fry", "Roast"]
      };
      const noun = nouns[cat][Math.floor(Math.random() * nouns[cat].length)];
      const adjectives = ["Zesty", "Savory", "Herb-Crusted", "Golden", "Spiced", "Seared", "Roasted", "Fresh"];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const mainIng = userIngredients[0] || "Protein";
      const title = `${adj} ${mainIng} ${noun}`;

      const proteinG = Math.round((mealCal * 0.3) / 4);
      const carbsG = Math.round((mealCal * 0.4) / 4);
      const fatG = Math.round((mealCal * 0.3) / 9);

      const ingredients: { item: string; amount: string; cal: number }[] = [];
      const calPerIng = Math.round(mealCal / (userIngredients.length + 3));

      userIngredients.forEach((ing, idx) => {
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

      const catImages: Record<string, string[]> = {
        lunch: [lunch1, lunch2, lunch3],
        dinner: [dinner1, dinner2, dinner3]
      };
      const nounImgMap: Record<string, number> = { Wrap: 0, Salad: 1, Bowl: 2, Skillet: 0, Roast: 1, "Stir-fry": 2 };

      setGeneratedRecipe({
        id: Date.now(),
        title,
        type: cat,
        cuisine: "custom",
        calories: mealCal,
        protein: `${proteinG}g`,
        carbs: `${carbsG}g`,
        fat: `${fatG}g`,
        time: `${15 + Math.floor(Math.random() * 4) * 5} min`,
        image: catImages[cat][nounImgMap[noun] ?? 0],
        match: "Custom",
        ingredients,
        steps: stepSets[noun] || stepSets.Skillet
      });
      setIsGenerating(false);
    }, 1200);
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

                <div className="text-center py-3 px-4 rounded-xl bg-secondary/10 border border-secondary/20">
                  {targetCalories - trackedFoods.reduce((acc, food) => acc + food.calories, 0) > 0 ? (
                    <div>
                      <span className="text-2xl font-display font-bold text-secondary">{targetCalories - trackedFoods.reduce((acc, food) => acc + food.calories, 0)}</span>
                      <span className="text-sm font-medium text-secondary/80 ml-1.5">calories remaining</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-2xl font-display font-bold text-red-500">{Math.abs(targetCalories - trackedFoods.reduce((acc, food) => acc + food.calories, 0))}</span>
                      <span className="text-sm font-medium text-red-400 ml-1.5">calories over goal</span>
                    </div>
                  )}
                </div>

                {/* Add Custom Food */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-700">Quick Add</h4>
                    <div className="flex gap-1.5">
                      <BarcodeScanner onLog={(food) => {
                        addFoodMutation.mutate(food);
                      }} />
                      <MealScanner onLog={(food) => {
                        addFoodMutation.mutate(food);
                      }} />
                    </div>
                  </div>
                  <FoodSearch onAdd={(food) => addFoodMutation.mutate(food)} />
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
                        <Button 
                          className="flex-1 bg-slate-50 hover:bg-slate-100 text-foreground border border-slate-200" 
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
                        Tell us what ingredients you have, separated by commas, and we'll generate a custom recipe tailored to {Math.round(targetCalories / 3)} calories (your target per meal).
                      </p>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold">What ingredients do you have?</Label>
                          <Input 
                            placeholder="e.g. Chicken breast, broccoli, rice..." 
                            className="h-12 bg-white border-blue-200 shadow-sm"
                            value={generatorIngredients}
                            onChange={(e) => setGeneratorIngredients(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateRecipe()}
                            data-testid="input-generator-ingredients"
                          />
                        </div>
                        <Button 
                          className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white h-12 px-8"
                          onClick={handleGenerateRecipe}
                          disabled={isGenerating || !generatorIngredients.trim()}
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
                  <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-72 h-48 md:h-auto overflow-hidden flex-shrink-0">
                        <div className="absolute top-3 left-3 z-10 bg-accent/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                          {generatedRecipe.match}
                        </div>
                        <img 
                          src={generatedRecipe.image} 
                          alt={generatedRecipe.title} 
                          className="w-full h-full object-cover"
                        />
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
                          <div className="h-8 w-px bg-slate-100"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Protein</span>
                            <span className="font-medium text-blue-600">{generatedRecipe.protein}</span>
                          </div>
                          <div className="h-8 w-px bg-slate-100"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Carbs</span>
                            <span className="font-medium text-emerald-600">{generatedRecipe.carbs}</span>
                          </div>
                          <div className="h-8 w-px bg-slate-100"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Fat</span>
                            <span className="font-medium text-amber-600">{generatedRecipe.fat}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline"
                            className="flex-1 bg-slate-50 hover:bg-slate-100 text-foreground border border-slate-200"
                            onClick={() => setSelectedRecipe(generatedRecipe)}
                            data-testid="button-view-generated-recipe"
                          >
                            View Recipe
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
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </main>

      <Dialog open={!!selectedRecipe} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
        {selectedRecipe && (
          <DialogContent className="max-w-md p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="relative h-56 overflow-hidden">
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                {selectedRecipe.match}
              </div>
            </div>
            <div className="p-6 space-y-5">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{selectedRecipe.title}</DialogTitle>
                <DialogDescription className="capitalize">{selectedRecipe.type} · {selectedRecipe.cuisine === 'all' ? 'Balanced' : selectedRecipe.cuisine}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Calories</div>
                  <div className="font-bold text-lg text-foreground">{selectedRecipe.calories}</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Protein</div>
                  <div className="font-bold text-lg text-blue-600">{selectedRecipe.protein}</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Carbs</div>
                  <div className="font-bold text-lg text-emerald-600">{selectedRecipe.carbs}</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
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
                      <li key={idx} className="flex items-center justify-between text-sm py-1 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0"></span>
                          <span className="text-slate-700">{ing.item}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-slate-400 text-xs">{ing.amount}</span>
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
                        <span className="text-slate-600 leading-relaxed">{step}</span>
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
    </div>
  );
}