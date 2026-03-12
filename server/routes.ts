import type { Express } from "express";
import express from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertFoodEntrySchema, updateUserProfileSchema, insertSavedRecipeSchema, insertPlannedMealSchema, insertExerciseEntrySchema } from "@shared/schema";
import OpenAI from "openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/profile", async (_req, res) => {
    try {
      const profile = await storage.getDefaultProfile();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to load profile" });
    }
  });

  app.patch("/api/profile/:id", async (req, res) => {
    try {
      const parsed = updateUserProfileSchema.parse(req.body);
      const profile = await storage.updateProfile(req.params.id, parsed);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.get("/api/food-entries/:profileId/frequent", async (req, res) => {
    try {
      const foods = await storage.getFrequentFoods(req.params.profileId);
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: "Failed to load frequent foods" });
    }
  });

  app.get("/api/food-entries/:profileId/range/:startDate/:endDate", async (req, res) => {
    try {
      const entries = await storage.getFoodEntriesForRange(req.params.profileId, req.params.startDate, req.params.endDate);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to load food entries for range" });
    }
  });

  app.get("/api/food-entries/:profileId/:date", async (req, res) => {
    try {
      const entries = await storage.getFoodEntries(req.params.profileId, req.params.date);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to load food entries" });
    }
  });

  app.post("/api/food-entries", async (req, res) => {
    try {
      const parsed = insertFoodEntrySchema.parse(req.body);
      const entry = await storage.addFoodEntry(parsed);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid food entry data" });
    }
  });

  app.delete("/api/food-entries/:id", async (req, res) => {
    try {
      await storage.removeFoodEntry(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove food entry" });
    }
  });

  app.get("/api/saved-recipes/:profileId", async (req, res) => {
    try {
      const recipes = await storage.getSavedRecipes(req.params.profileId);
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to load saved recipes" });
    }
  });

  app.post("/api/saved-recipes", async (req, res) => {
    try {
      const parsed = insertSavedRecipeSchema.parse(req.body);
      const recipe = await storage.addSavedRecipe(parsed);
      res.json(recipe);
    } catch (error) {
      res.status(400).json({ message: "Invalid recipe data" });
    }
  });

  app.delete("/api/saved-recipes/:id", async (req, res) => {
    try {
      await storage.removeSavedRecipe(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove saved recipe" });
    }
  });

  app.get("/api/planned-meals/:profileId/:startDate/:endDate", async (req, res) => {
    try {
      const meals = await storage.getPlannedMeals(req.params.profileId, req.params.startDate, req.params.endDate);
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: "Failed to load planned meals" });
    }
  });

  app.post("/api/planned-meals", async (req, res) => {
    try {
      const { meals } = req.body;
      if (!Array.isArray(meals)) {
        return res.status(400).json({ message: "meals must be an array" });
      }
      const parsed = meals.map((m: any) => insertPlannedMealSchema.parse(m));
      const created = await storage.addPlannedMeals(parsed);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid planned meal data" });
    }
  });

  app.delete("/api/planned-meals/:profileId/:startDate/:endDate", async (req, res) => {
    try {
      await storage.clearPlannedMealsForWeek(req.params.profileId, req.params.startDate, req.params.endDate);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear planned meals" });
    }
  });

  app.get("/api/exercise-entries/:profileId/:date", async (req, res) => {
    try {
      const entries = await storage.getExerciseEntries(req.params.profileId, req.params.date);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to load exercise entries" });
    }
  });

  app.post("/api/exercise-entries", async (req, res) => {
    try {
      const parsed = insertExerciseEntrySchema.parse(req.body);
      const entry = await storage.addExerciseEntry(parsed);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid exercise entry data" });
    }
  });

  app.delete("/api/exercise-entries/:id", async (req, res) => {
    try {
      await storage.removeExerciseEntry(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove exercise entry" });
    }
  });

  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  app.post("/api/analyze-meal", express.json({ limit: "10mb" }), async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ message: "Image data is required" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a nutrition analysis expert. Analyze the food in the image and identify each distinct food item with its estimated portion size and calorie count. Return ONLY valid JSON in this exact format:
{
  "items": [
    { "name": "Food item name", "portion": "estimated portion size", "calories": 250, "protein": 20, "carbs": 30, "fat": 8 }
  ],
  "totalCalories": 500,
  "confidence": "high"
}
The confidence field should be "high", "medium", or "low" based on how clearly the food items are visible. Be realistic with calorie estimates based on typical serving sizes visible in the photo.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this meal photo. Identify each food item, estimate portion sizes, and calculate calories and macros for each item." },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "";
      let analysis: any;
      try {
        analysis = JSON.parse(content);
      } catch {
        return res.status(422).json({ message: "Could not analyze the image. Please try a clearer photo." });
      }

      if (!analysis.items || !Array.isArray(analysis.items) || analysis.items.length === 0) {
        return res.status(422).json({ message: "No food items detected. Please try a clearer photo of your meal." });
      }

      analysis.items = analysis.items.map((item: any) => ({
        name: String(item.name || "Unknown item"),
        portion: String(item.portion || "1 serving"),
        calories: Math.max(0, Math.round(Number(item.calories) || 0)),
        protein: Math.max(0, Math.round(Number(item.protein) || 0)),
        carbs: Math.max(0, Math.round(Number(item.carbs) || 0)),
        fat: Math.max(0, Math.round(Number(item.fat) || 0)),
      }));
      analysis.totalCalories = analysis.items.reduce((sum: number, i: any) => sum + i.calories, 0);
      analysis.confidence = ["high", "medium", "low"].includes(analysis.confidence) ? analysis.confidence : "medium";

      res.json(analysis);
    } catch (error: any) {
      console.error("Meal analysis error:", error);
      if (error?.message?.includes("FREE_CLOUD_BUDGET_EXCEEDED")) {
        return res.status(402).json({ message: "AI usage limit reached. Please try again later." });
      }
      res.status(500).json({ message: "Failed to analyze meal image" });
    }
  });

  app.post("/api/read-barcode", express.json({ limit: "10mb" }), async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ message: "Image data is required" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a barcode reading expert. Look at the image and find any barcode (UPC, EAN, etc). Return ONLY valid JSON: { "code": "the barcode number" } or { "code": null } if no barcode is found. Only return the numeric barcode value, nothing else.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Read the barcode number from this image." },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 100,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "";
      const result = JSON.parse(content);
      res.json({ code: result.code || null });
    } catch (error: any) {
      console.error("Barcode reading error:", error);
      if (error?.message?.includes("FREE_CLOUD_BUDGET_EXCEEDED")) {
        return res.status(402).json({ message: "AI usage limit reached." });
      }
      res.status(500).json({ code: null });
    }
  });

  return httpServer;
}
