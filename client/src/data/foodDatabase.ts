export interface FoodItem {
  name: string;
  serving: string;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
}

export const foodDatabase: FoodItem[] = [
  { name: "Chicken Breast (grilled)", serving: "4 oz", unit: "grams (113g)", calories: 187, protein: 35, carbs: 0, fat: 4, category: "protein" },
  { name: "Chicken Breast (fried)", serving: "4 oz", unit: "grams (113g)", calories: 252, protein: 30, carbs: 10, fat: 11, category: "protein" },
  { name: "Chicken Thigh (bone-in)", serving: "1 thigh", unit: "piece (116g)", calories: 229, protein: 28, carbs: 0, fat: 12, category: "protein" },
  { name: "Chicken Thigh (boneless)", serving: "3 oz", unit: "grams (85g)", calories: 170, protein: 22, carbs: 0, fat: 9, category: "protein" },
  { name: "Chicken Wings (buffalo)", serving: "4 wings", unit: "pieces", calories: 368, protein: 28, carbs: 2, fat: 28, category: "protein" },
  { name: "Chicken Wings (plain)", serving: "4 wings", unit: "pieces", calories: 320, protein: 27, carbs: 0, fat: 22, category: "protein" },
  { name: "Chicken Nuggets", serving: "6 pieces", unit: "pieces", calories: 295, protein: 14, carbs: 18, fat: 18, category: "protein" },
  { name: "Chicken Tenders", serving: "3 pieces", unit: "pieces", calories: 340, protein: 25, carbs: 20, fat: 18, category: "protein" },
  { name: "Chicken Caesar Salad", serving: "1 bowl", unit: "serving (350g)", calories: 440, protein: 35, carbs: 12, fat: 28, category: "meal" },
  { name: "Chicken Burrito", serving: "1 burrito", unit: "piece", calories: 580, protein: 32, carbs: 62, fat: 22, category: "meal" },
  { name: "Chicken Quesadilla", serving: "1 quesadilla", unit: "piece", calories: 490, protein: 28, carbs: 36, fat: 26, category: "meal" },
  { name: "Chicken Sandwich (grilled)", serving: "1 sandwich", unit: "piece", calories: 420, protein: 35, carbs: 40, fat: 14, category: "meal" },
  { name: "Chicken Soup", serving: "1 cup", unit: "cup (245g)", calories: 75, protein: 6, carbs: 9, fat: 2, category: "meal" },
  { name: "Chicken Fried Rice", serving: "1 cup", unit: "cup (200g)", calories: 335, protein: 14, carbs: 42, fat: 12, category: "meal" },
  { name: "Chicken Stir-fry", serving: "1 cup", unit: "cup (220g)", calories: 280, protein: 26, carbs: 18, fat: 12, category: "meal" },
  { name: "Chicken Parmesan", serving: "1 piece", unit: "serving (280g)", calories: 510, protein: 38, carbs: 28, fat: 26, category: "meal" },

  { name: "Beef Steak (sirloin)", serving: "6 oz", unit: "grams (170g)", calories: 312, protein: 42, carbs: 0, fat: 15, category: "protein" },
  { name: "Beef Steak (ribeye)", serving: "6 oz", unit: "grams (170g)", calories: 420, protein: 38, carbs: 0, fat: 30, category: "protein" },
  { name: "Ground Beef (80/20)", serving: "4 oz", unit: "grams (113g)", calories: 287, protein: 19, carbs: 0, fat: 23, category: "protein" },
  { name: "Ground Beef (90/10)", serving: "4 oz", unit: "grams (113g)", calories: 200, protein: 22, carbs: 0, fat: 11, category: "protein" },
  { name: "Beef Burger Patty", serving: "1 patty", unit: "piece (113g)", calories: 287, protein: 19, carbs: 0, fat: 23, category: "protein" },
  { name: "Beef Jerky", serving: "1 oz", unit: "grams (28g)", calories: 82, protein: 14, carbs: 3, fat: 1, category: "snack" },
  { name: "Beef Tacos", serving: "2 tacos", unit: "pieces", calories: 430, protein: 24, carbs: 32, fat: 22, category: "meal" },
  { name: "Meatballs (beef)", serving: "5 meatballs", unit: "pieces", calories: 295, protein: 22, carbs: 8, fat: 20, category: "protein" },

  { name: "Pork Chop (grilled)", serving: "1 chop", unit: "piece (145g)", calories: 260, protein: 32, carbs: 0, fat: 14, category: "protein" },
  { name: "Pork Tenderloin", serving: "4 oz", unit: "grams (113g)", calories: 165, protein: 26, carbs: 0, fat: 6, category: "protein" },
  { name: "Bacon", serving: "3 slices", unit: "slices", calories: 129, protein: 9, carbs: 0, fat: 10, category: "protein" },
  { name: "Bacon (turkey)", serving: "3 slices", unit: "slices", calories: 90, protein: 10, carbs: 1, fat: 5, category: "protein" },
  { name: "Ham (deli sliced)", serving: "3 slices", unit: "slices (85g)", calories: 90, protein: 14, carbs: 2, fat: 3, category: "protein" },
  { name: "Sausage Link (pork)", serving: "2 links", unit: "pieces", calories: 220, protein: 12, carbs: 1, fat: 18, category: "protein" },
  { name: "Hot Dog", serving: "1 hot dog", unit: "piece", calories: 290, protein: 11, carbs: 22, fat: 17, category: "meal" },
  { name: "Pulled Pork", serving: "4 oz", unit: "grams (113g)", calories: 230, protein: 26, carbs: 4, fat: 12, category: "protein" },

  { name: "Salmon Fillet (baked)", serving: "4 oz", unit: "grams (113g)", calories: 234, protein: 25, carbs: 0, fat: 14, category: "protein" },
  { name: "Salmon (smoked)", serving: "3 oz", unit: "grams (85g)", calories: 100, protein: 16, carbs: 0, fat: 4, category: "protein" },
  { name: "Tuna (canned in water)", serving: "1 can", unit: "can (142g)", calories: 191, protein: 42, carbs: 0, fat: 1, category: "protein" },
  { name: "Tuna Salad", serving: "½ cup", unit: "cup (100g)", calories: 192, protein: 16, carbs: 10, fat: 10, category: "meal" },
  { name: "Shrimp (grilled)", serving: "6 large", unit: "pieces (100g)", calories: 120, protein: 24, carbs: 1, fat: 2, category: "protein" },
  { name: "Shrimp (fried)", serving: "6 large", unit: "pieces (120g)", calories: 240, protein: 18, carbs: 16, fat: 12, category: "protein" },
  { name: "Fish Sticks", serving: "4 sticks", unit: "pieces", calories: 260, protein: 12, carbs: 24, fat: 13, category: "protein" },
  { name: "Tilapia (baked)", serving: "4 oz", unit: "grams (113g)", calories: 145, protein: 30, carbs: 0, fat: 3, category: "protein" },
  { name: "Cod (baked)", serving: "4 oz", unit: "grams (113g)", calories: 120, protein: 26, carbs: 0, fat: 1, category: "protein" },
  { name: "Crab Cake", serving: "1 cake", unit: "piece (100g)", calories: 220, protein: 14, carbs: 10, fat: 14, category: "protein" },

  { name: "Turkey Breast (deli)", serving: "4 slices", unit: "slices (112g)", calories: 120, protein: 22, carbs: 2, fat: 2, category: "protein" },
  { name: "Turkey Burger", serving: "1 patty", unit: "piece (113g)", calories: 170, protein: 21, carbs: 0, fat: 9, category: "protein" },
  { name: "Turkey (roasted)", serving: "4 oz", unit: "grams (113g)", calories: 178, protein: 30, carbs: 0, fat: 5, category: "protein" },

  { name: "Egg (large, scrambled)", serving: "2 eggs", unit: "pieces", calories: 182, protein: 12, carbs: 2, fat: 14, category: "protein" },
  { name: "Egg (large, boiled)", serving: "2 eggs", unit: "pieces", calories: 154, protein: 13, carbs: 1, fat: 10, category: "protein" },
  { name: "Egg (fried)", serving: "2 eggs", unit: "pieces", calories: 184, protein: 12, carbs: 1, fat: 14, category: "protein" },
  { name: "Egg White", serving: "3 whites", unit: "pieces", calories: 51, protein: 11, carbs: 1, fat: 0, category: "protein" },
  { name: "Omelette (cheese)", serving: "1 omelette", unit: "serving (180g)", calories: 340, protein: 22, carbs: 2, fat: 26, category: "meal" },
  { name: "Omelette (veggie)", serving: "1 omelette", unit: "serving (200g)", calories: 260, protein: 18, carbs: 8, fat: 18, category: "meal" },

  { name: "White Rice (cooked)", serving: "1 cup", unit: "cup (186g)", calories: 242, protein: 4, carbs: 53, fat: 0, category: "grain" },
  { name: "Brown Rice (cooked)", serving: "1 cup", unit: "cup (195g)", calories: 216, protein: 5, carbs: 45, fat: 2, category: "grain" },
  { name: "Quinoa (cooked)", serving: "1 cup", unit: "cup (185g)", calories: 222, protein: 8, carbs: 39, fat: 4, category: "grain" },
  { name: "Pasta (cooked)", serving: "1 cup", unit: "cup (140g)", calories: 220, protein: 8, carbs: 43, fat: 1, category: "grain" },
  { name: "Spaghetti with Meat Sauce", serving: "1 plate", unit: "serving (350g)", calories: 520, protein: 24, carbs: 62, fat: 18, category: "meal" },
  { name: "Mac and Cheese", serving: "1 cup", unit: "cup (200g)", calories: 380, protein: 14, carbs: 40, fat: 18, category: "meal" },
  { name: "Oatmeal (plain)", serving: "1 cup", unit: "cup (234g)", calories: 154, protein: 6, carbs: 27, fat: 3, category: "grain" },
  { name: "Oatmeal (with brown sugar)", serving: "1 cup", unit: "cup (250g)", calories: 210, protein: 6, carbs: 40, fat: 3, category: "grain" },
  { name: "Bread (white, 1 slice)", serving: "1 slice", unit: "slice (30g)", calories: 79, protein: 3, carbs: 15, fat: 1, category: "grain" },
  { name: "Bread (whole wheat, 1 slice)", serving: "1 slice", unit: "slice (33g)", calories: 81, protein: 4, carbs: 14, fat: 1, category: "grain" },
  { name: "Bagel (plain)", serving: "1 bagel", unit: "piece (105g)", calories: 270, protein: 10, carbs: 53, fat: 2, category: "grain" },
  { name: "English Muffin", serving: "1 muffin", unit: "piece (57g)", calories: 132, protein: 5, carbs: 26, fat: 1, category: "grain" },
  { name: "Tortilla (flour, 8\")", serving: "1 tortilla", unit: "piece (49g)", calories: 146, protein: 4, carbs: 24, fat: 4, category: "grain" },
  { name: "Tortilla (corn)", serving: "2 tortillas", unit: "pieces (52g)", calories: 110, protein: 3, carbs: 23, fat: 1, category: "grain" },
  { name: "Pancakes", serving: "2 pancakes", unit: "pieces (152g)", calories: 350, protein: 8, carbs: 46, fat: 14, category: "meal" },
  { name: "Waffle (frozen)", serving: "2 waffles", unit: "pieces (70g)", calories: 190, protein: 4, carbs: 30, fat: 6, category: "grain" },
  { name: "French Toast", serving: "2 slices", unit: "pieces (130g)", calories: 300, protein: 10, carbs: 32, fat: 14, category: "meal" },
  { name: "Granola Bar", serving: "1 bar", unit: "bar (42g)", calories: 190, protein: 3, carbs: 29, fat: 7, category: "snack" },
  { name: "Cereal (Cheerios)", serving: "1 cup", unit: "cup (28g)", calories: 100, protein: 3, carbs: 20, fat: 2, category: "grain" },
  { name: "Cereal (Frosted Flakes)", serving: "1 cup", unit: "cup (37g)", calories: 140, protein: 1, carbs: 34, fat: 0, category: "grain" },
  { name: "Granola", serving: "½ cup", unit: "cup (60g)", calories: 300, protein: 7, carbs: 32, fat: 16, category: "grain" },

  { name: "Banana", serving: "1 medium", unit: "piece (118g)", calories: 105, protein: 1, carbs: 27, fat: 0, category: "fruit" },
  { name: "Apple", serving: "1 medium", unit: "piece (182g)", calories: 95, protein: 0, carbs: 25, fat: 0, category: "fruit" },
  { name: "Orange", serving: "1 medium", unit: "piece (131g)", calories: 62, protein: 1, carbs: 15, fat: 0, category: "fruit" },
  { name: "Strawberries", serving: "1 cup", unit: "cup (152g)", calories: 49, protein: 1, carbs: 12, fat: 0, category: "fruit" },
  { name: "Blueberries", serving: "1 cup", unit: "cup (148g)", calories: 84, protein: 1, carbs: 21, fat: 0, category: "fruit" },
  { name: "Grapes", serving: "1 cup", unit: "cup (151g)", calories: 104, protein: 1, carbs: 27, fat: 0, category: "fruit" },
  { name: "Watermelon", serving: "1 cup (diced)", unit: "cup (152g)", calories: 46, protein: 1, carbs: 12, fat: 0, category: "fruit" },
  { name: "Mango", serving: "1 cup (sliced)", unit: "cup (165g)", calories: 99, protein: 1, carbs: 25, fat: 1, category: "fruit" },
  { name: "Pineapple", serving: "1 cup (chunks)", unit: "cup (165g)", calories: 82, protein: 1, carbs: 22, fat: 0, category: "fruit" },
  { name: "Avocado", serving: "½ avocado", unit: "half (100g)", calories: 160, protein: 2, carbs: 9, fat: 15, category: "fruit" },
  { name: "Peach", serving: "1 medium", unit: "piece (150g)", calories: 59, protein: 1, carbs: 14, fat: 0, category: "fruit" },
  { name: "Pear", serving: "1 medium", unit: "piece (178g)", calories: 102, protein: 1, carbs: 27, fat: 0, category: "fruit" },

  { name: "Broccoli (steamed)", serving: "1 cup", unit: "cup (156g)", calories: 55, protein: 4, carbs: 11, fat: 1, category: "vegetable" },
  { name: "Spinach (raw)", serving: "2 cups", unit: "cups (60g)", calories: 14, protein: 2, carbs: 2, fat: 0, category: "vegetable" },
  { name: "Spinach (cooked)", serving: "1 cup", unit: "cup (180g)", calories: 41, protein: 5, carbs: 7, fat: 0, category: "vegetable" },
  { name: "Kale (raw)", serving: "2 cups", unit: "cups (67g)", calories: 33, protein: 3, carbs: 6, fat: 1, category: "vegetable" },
  { name: "Sweet Potato (baked)", serving: "1 medium", unit: "piece (114g)", calories: 103, protein: 2, carbs: 24, fat: 0, category: "vegetable" },
  { name: "Baked Potato", serving: "1 medium", unit: "piece (173g)", calories: 161, protein: 4, carbs: 37, fat: 0, category: "vegetable" },
  { name: "French Fries", serving: "1 medium", unit: "serving (117g)", calories: 365, protein: 4, carbs: 44, fat: 19, category: "side" },
  { name: "Mashed Potatoes", serving: "1 cup", unit: "cup (210g)", calories: 237, protein: 4, carbs: 35, fat: 9, category: "side" },
  { name: "Corn on the Cob", serving: "1 ear", unit: "piece (146g)", calories: 123, protein: 5, carbs: 27, fat: 2, category: "vegetable" },
  { name: "Green Beans (steamed)", serving: "1 cup", unit: "cup (125g)", calories: 44, protein: 2, carbs: 10, fat: 0, category: "vegetable" },
  { name: "Carrots (raw)", serving: "1 medium", unit: "piece (61g)", calories: 25, protein: 1, carbs: 6, fat: 0, category: "vegetable" },
  { name: "Bell Pepper (raw)", serving: "1 medium", unit: "piece (119g)", calories: 31, protein: 1, carbs: 6, fat: 0, category: "vegetable" },
  { name: "Cucumber (sliced)", serving: "1 cup", unit: "cup (119g)", calories: 16, protein: 1, carbs: 3, fat: 0, category: "vegetable" },
  { name: "Tomato (raw)", serving: "1 medium", unit: "piece (123g)", calories: 22, protein: 1, carbs: 5, fat: 0, category: "vegetable" },
  { name: "Onion (raw)", serving: "½ medium", unit: "half (55g)", calories: 22, protein: 1, carbs: 5, fat: 0, category: "vegetable" },
  { name: "Mushrooms (sliced)", serving: "1 cup", unit: "cup (70g)", calories: 15, protein: 2, carbs: 2, fat: 0, category: "vegetable" },
  { name: "Asparagus", serving: "6 spears", unit: "spears (90g)", calories: 20, protein: 2, carbs: 4, fat: 0, category: "vegetable" },
  { name: "Zucchini (sliced)", serving: "1 cup", unit: "cup (113g)", calories: 19, protein: 1, carbs: 4, fat: 0, category: "vegetable" },
  { name: "Cauliflower (steamed)", serving: "1 cup", unit: "cup (124g)", calories: 29, protein: 2, carbs: 5, fat: 0, category: "vegetable" },
  { name: "Side Salad (mixed greens)", serving: "2 cups", unit: "cups (85g)", calories: 20, protein: 2, carbs: 3, fat: 0, category: "vegetable" },
  { name: "Caesar Salad (no chicken)", serving: "1 bowl", unit: "serving (250g)", calories: 260, protein: 8, carbs: 10, fat: 22, category: "meal" },
  { name: "Coleslaw", serving: "½ cup", unit: "cup (60g)", calories: 82, protein: 1, carbs: 7, fat: 6, category: "side" },

  { name: "Milk (whole)", serving: "1 cup", unit: "cup (244ml)", calories: 149, protein: 8, carbs: 12, fat: 8, category: "dairy" },
  { name: "Milk (2%)", serving: "1 cup", unit: "cup (244ml)", calories: 122, protein: 8, carbs: 12, fat: 5, category: "dairy" },
  { name: "Milk (skim)", serving: "1 cup", unit: "cup (244ml)", calories: 83, protein: 8, carbs: 12, fat: 0, category: "dairy" },
  { name: "Almond Milk (unsweetened)", serving: "1 cup", unit: "cup (240ml)", calories: 30, protein: 1, carbs: 1, fat: 3, category: "dairy" },
  { name: "Oat Milk", serving: "1 cup", unit: "cup (240ml)", calories: 120, protein: 3, carbs: 16, fat: 5, category: "dairy" },
  { name: "Greek Yogurt (plain, nonfat)", serving: "1 cup", unit: "cup (227g)", calories: 130, protein: 22, carbs: 9, fat: 0, category: "dairy" },
  { name: "Greek Yogurt (vanilla)", serving: "1 cup", unit: "cup (227g)", calories: 180, protein: 18, carbs: 22, fat: 3, category: "dairy" },
  { name: "Yogurt (strawberry)", serving: "1 cup", unit: "cup (227g)", calories: 220, protein: 8, carbs: 38, fat: 3, category: "dairy" },
  { name: "Cottage Cheese (low-fat)", serving: "½ cup", unit: "cup (113g)", calories: 92, protein: 13, carbs: 5, fat: 2, category: "dairy" },
  { name: "Cheddar Cheese", serving: "1 oz", unit: "slice (28g)", calories: 114, protein: 7, carbs: 0, fat: 9, category: "dairy" },
  { name: "Mozzarella Cheese", serving: "1 oz", unit: "slice (28g)", calories: 85, protein: 6, carbs: 1, fat: 6, category: "dairy" },
  { name: "String Cheese", serving: "1 stick", unit: "piece (28g)", calories: 80, protein: 7, carbs: 1, fat: 5, category: "dairy" },
  { name: "Cream Cheese", serving: "2 tbsp", unit: "tablespoons (29g)", calories: 99, protein: 2, carbs: 2, fat: 10, category: "dairy" },
  { name: "Butter", serving: "1 tbsp", unit: "tablespoon (14g)", calories: 102, protein: 0, carbs: 0, fat: 12, category: "dairy" },

  { name: "Peanut Butter", serving: "2 tbsp", unit: "tablespoons (32g)", calories: 188, protein: 7, carbs: 7, fat: 16, category: "snack" },
  { name: "Almond Butter", serving: "2 tbsp", unit: "tablespoons (32g)", calories: 196, protein: 7, carbs: 6, fat: 18, category: "snack" },
  { name: "Almonds", serving: "¼ cup", unit: "cup (35g)", calories: 207, protein: 8, carbs: 7, fat: 18, category: "snack" },
  { name: "Cashews", serving: "¼ cup", unit: "cup (32g)", calories: 180, protein: 5, carbs: 10, fat: 14, category: "snack" },
  { name: "Walnuts", serving: "¼ cup", unit: "cup (30g)", calories: 196, protein: 5, carbs: 4, fat: 20, category: "snack" },
  { name: "Mixed Nuts", serving: "¼ cup", unit: "cup (36g)", calories: 203, protein: 6, carbs: 8, fat: 18, category: "snack" },
  { name: "Trail Mix", serving: "¼ cup", unit: "cup (38g)", calories: 175, protein: 5, carbs: 16, fat: 11, category: "snack" },
  { name: "Sunflower Seeds", serving: "¼ cup", unit: "cup (35g)", calories: 207, protein: 7, carbs: 7, fat: 18, category: "snack" },
  { name: "Hummus", serving: "¼ cup", unit: "cup (62g)", calories: 104, protein: 5, carbs: 9, fat: 6, category: "snack" },
  { name: "Guacamole", serving: "¼ cup", unit: "cup (60g)", calories: 100, protein: 1, carbs: 6, fat: 9, category: "snack" },
  { name: "Salsa", serving: "¼ cup", unit: "cup (65g)", calories: 18, protein: 1, carbs: 4, fat: 0, category: "condiment" },

  { name: "Protein Bar", serving: "1 bar", unit: "bar (60g)", calories: 230, protein: 20, carbs: 24, fat: 8, category: "snack" },
  { name: "Protein Shake (whey)", serving: "1 scoop + water", unit: "serving (35g)", calories: 130, protein: 25, carbs: 3, fat: 2, category: "snack" },
  { name: "Protein Shake (with milk)", serving: "1 scoop + milk", unit: "serving (280ml)", calories: 260, protein: 33, carbs: 15, fat: 6, category: "snack" },

  { name: "Pizza (cheese, 1 slice)", serving: "1 slice", unit: "slice (107g)", calories: 272, protein: 12, carbs: 34, fat: 10, category: "meal" },
  { name: "Pizza (pepperoni, 1 slice)", serving: "1 slice", unit: "slice (113g)", calories: 311, protein: 13, carbs: 34, fat: 14, category: "meal" },
  { name: "Cheeseburger", serving: "1 burger", unit: "piece", calories: 535, protein: 28, carbs: 40, fat: 30, category: "meal" },
  { name: "Hamburger (single patty)", serving: "1 burger", unit: "piece", calories: 410, protein: 23, carbs: 38, fat: 20, category: "meal" },
  { name: "Fish & Chips", serving: "1 plate", unit: "serving (350g)", calories: 585, protein: 22, carbs: 60, fat: 28, category: "meal" },
  { name: "Grilled Cheese Sandwich", serving: "1 sandwich", unit: "piece", calories: 366, protein: 14, carbs: 28, fat: 22, category: "meal" },
  { name: "BLT Sandwich", serving: "1 sandwich", unit: "piece", calories: 344, protein: 14, carbs: 30, fat: 18, category: "meal" },
  { name: "Club Sandwich", serving: "1 sandwich", unit: "piece", calories: 546, protein: 30, carbs: 42, fat: 28, category: "meal" },
  { name: "PB&J Sandwich", serving: "1 sandwich", unit: "piece", calories: 376, protein: 13, carbs: 52, fat: 14, category: "meal" },
  { name: "Burrito Bowl", serving: "1 bowl", unit: "serving (400g)", calories: 590, protein: 28, carbs: 68, fat: 22, category: "meal" },
  { name: "Pad Thai", serving: "1 plate", unit: "serving (300g)", calories: 440, protein: 18, carbs: 52, fat: 18, category: "meal" },
  { name: "Fried Rice", serving: "1 cup", unit: "cup (200g)", calories: 310, protein: 8, carbs: 42, fat: 12, category: "meal" },
  { name: "Ramen (instant)", serving: "1 packet", unit: "serving (85g dry)", calories: 380, protein: 8, carbs: 52, fat: 14, category: "meal" },
  { name: "Sushi Roll (California)", serving: "8 pieces", unit: "pieces (220g)", calories: 262, protein: 9, carbs: 38, fat: 7, category: "meal" },
  { name: "Sushi Roll (Spicy Tuna)", serving: "8 pieces", unit: "pieces (220g)", calories: 290, protein: 15, carbs: 36, fat: 10, category: "meal" },

  { name: "Chips (potato)", serving: "1 oz", unit: "bag (28g)", calories: 152, protein: 2, carbs: 15, fat: 10, category: "snack" },
  { name: "Chips (tortilla)", serving: "1 oz", unit: "bag (28g)", calories: 142, protein: 2, carbs: 18, fat: 7, category: "snack" },
  { name: "Popcorn (buttered)", serving: "3 cups", unit: "cups (33g)", calories: 164, protein: 2, carbs: 16, fat: 10, category: "snack" },
  { name: "Popcorn (air-popped)", serving: "3 cups", unit: "cups (24g)", calories: 93, protein: 3, carbs: 19, fat: 1, category: "snack" },
  { name: "Pretzels", serving: "1 oz", unit: "bag (28g)", calories: 108, protein: 3, carbs: 23, fat: 1, category: "snack" },
  { name: "Rice Cakes (plain)", serving: "2 cakes", unit: "pieces (18g)", calories: 70, protein: 1, carbs: 15, fat: 1, category: "snack" },
  { name: "Crackers (saltine)", serving: "5 crackers", unit: "pieces (15g)", calories: 63, protein: 1, carbs: 11, fat: 2, category: "snack" },
  { name: "Crackers (whole wheat)", serving: "6 crackers", unit: "pieces (30g)", calories: 120, protein: 3, carbs: 20, fat: 4, category: "snack" },

  { name: "Dark Chocolate", serving: "1 oz", unit: "square (28g)", calories: 170, protein: 2, carbs: 13, fat: 12, category: "snack" },
  { name: "Milk Chocolate", serving: "1 oz", unit: "square (28g)", calories: 153, protein: 2, carbs: 17, fat: 9, category: "snack" },
  { name: "Ice Cream (vanilla)", serving: "½ cup", unit: "cup (66g)", calories: 137, protein: 2, carbs: 16, fat: 7, category: "dessert" },
  { name: "Ice Cream (chocolate)", serving: "½ cup", unit: "cup (66g)", calories: 143, protein: 3, carbs: 19, fat: 7, category: "dessert" },
  { name: "Frozen Yogurt", serving: "½ cup", unit: "cup (72g)", calories: 110, protein: 3, carbs: 22, fat: 1, category: "dessert" },
  { name: "Cookie (chocolate chip)", serving: "2 cookies", unit: "pieces (60g)", calories: 280, protein: 3, carbs: 38, fat: 14, category: "dessert" },
  { name: "Brownie", serving: "1 brownie", unit: "piece (56g)", calories: 227, protein: 3, carbs: 36, fat: 9, category: "dessert" },
  { name: "Donut (glazed)", serving: "1 donut", unit: "piece (60g)", calories: 253, protein: 3, carbs: 31, fat: 14, category: "dessert" },
  { name: "Muffin (blueberry)", serving: "1 muffin", unit: "piece (113g)", calories: 340, protein: 5, carbs: 50, fat: 14, category: "dessert" },
  { name: "Cupcake (frosted)", serving: "1 cupcake", unit: "piece (64g)", calories: 246, protein: 2, carbs: 36, fat: 11, category: "dessert" },
  { name: "Cheesecake", serving: "1 slice", unit: "slice (125g)", calories: 401, protein: 7, carbs: 28, fat: 30, category: "dessert" },
  { name: "Apple Pie", serving: "1 slice", unit: "slice (125g)", calories: 296, protein: 2, carbs: 43, fat: 14, category: "dessert" },

  { name: "Coffee (black)", serving: "1 cup", unit: "cup (240ml)", calories: 2, protein: 0, carbs: 0, fat: 0, category: "beverage" },
  { name: "Coffee (with cream & sugar)", serving: "1 cup", unit: "cup (260ml)", calories: 75, protein: 1, carbs: 10, fat: 4, category: "beverage" },
  { name: "Latte (whole milk)", serving: "12 oz", unit: "cup (360ml)", calories: 200, protein: 10, carbs: 16, fat: 11, category: "beverage" },
  { name: "Latte (oat milk)", serving: "12 oz", unit: "cup (360ml)", calories: 170, protein: 5, carbs: 22, fat: 7, category: "beverage" },
  { name: "Cappuccino", serving: "12 oz", unit: "cup (360ml)", calories: 130, protein: 8, carbs: 10, fat: 7, category: "beverage" },
  { name: "Iced Coffee (sweetened)", serving: "16 oz", unit: "cup (480ml)", calories: 120, protein: 2, carbs: 22, fat: 3, category: "beverage" },
  { name: "Mocha (with whip)", serving: "12 oz", unit: "cup (360ml)", calories: 340, protein: 10, carbs: 42, fat: 16, category: "beverage" },
  { name: "Frappuccino", serving: "16 oz", unit: "cup (480ml)", calories: 380, protein: 5, carbs: 60, fat: 14, category: "beverage" },
  { name: "Green Tea", serving: "1 cup", unit: "cup (240ml)", calories: 2, protein: 0, carbs: 0, fat: 0, category: "beverage" },
  { name: "Orange Juice", serving: "1 cup", unit: "cup (248ml)", calories: 112, protein: 2, carbs: 26, fat: 0, category: "beverage" },
  { name: "Apple Juice", serving: "1 cup", unit: "cup (248ml)", calories: 114, protein: 0, carbs: 28, fat: 0, category: "beverage" },
  { name: "Smoothie (fruit)", serving: "12 oz", unit: "cup (360ml)", calories: 240, protein: 4, carbs: 52, fat: 2, category: "beverage" },
  { name: "Smoothie (protein)", serving: "16 oz", unit: "cup (480ml)", calories: 320, protein: 28, carbs: 40, fat: 6, category: "beverage" },
  { name: "Soda (cola)", serving: "12 oz", unit: "can (355ml)", calories: 140, protein: 0, carbs: 39, fat: 0, category: "beverage" },
  { name: "Soda (diet)", serving: "12 oz", unit: "can (355ml)", calories: 0, protein: 0, carbs: 0, fat: 0, category: "beverage" },
  { name: "Sparkling Water", serving: "12 oz", unit: "can (355ml)", calories: 0, protein: 0, carbs: 0, fat: 0, category: "beverage" },
  { name: "Energy Drink", serving: "16 oz", unit: "can (473ml)", calories: 210, protein: 0, carbs: 54, fat: 0, category: "beverage" },
  { name: "Sports Drink (Gatorade)", serving: "20 oz", unit: "bottle (591ml)", calories: 140, protein: 0, carbs: 36, fat: 0, category: "beverage" },
  { name: "Beer (regular)", serving: "12 oz", unit: "can (355ml)", calories: 153, protein: 2, carbs: 13, fat: 0, category: "beverage" },
  { name: "Beer (light)", serving: "12 oz", unit: "can (355ml)", calories: 103, protein: 1, carbs: 6, fat: 0, category: "beverage" },
  { name: "Wine (red)", serving: "5 oz", unit: "glass (148ml)", calories: 125, protein: 0, carbs: 4, fat: 0, category: "beverage" },
  { name: "Wine (white)", serving: "5 oz", unit: "glass (148ml)", calories: 121, protein: 0, carbs: 4, fat: 0, category: "beverage" },
  { name: "Margarita", serving: "8 oz", unit: "glass (240ml)", calories: 274, protein: 0, carbs: 36, fat: 0, category: "beverage" },

  { name: "Black Beans (cooked)", serving: "½ cup", unit: "cup (86g)", calories: 114, protein: 8, carbs: 20, fat: 0, category: "legume" },
  { name: "Kidney Beans (cooked)", serving: "½ cup", unit: "cup (89g)", calories: 112, protein: 8, carbs: 20, fat: 0, category: "legume" },
  { name: "Chickpeas (cooked)", serving: "½ cup", unit: "cup (82g)", calories: 134, protein: 7, carbs: 22, fat: 2, category: "legume" },
  { name: "Lentils (cooked)", serving: "½ cup", unit: "cup (99g)", calories: 115, protein: 9, carbs: 20, fat: 0, category: "legume" },
  { name: "Edamame", serving: "1 cup", unit: "cup (155g)", calories: 188, protein: 18, carbs: 14, fat: 8, category: "legume" },
  { name: "Tofu (firm)", serving: "½ cup", unit: "cup (126g)", calories: 88, protein: 10, carbs: 2, fat: 5, category: "protein" },

  { name: "Olive Oil", serving: "1 tbsp", unit: "tablespoon (14ml)", calories: 119, protein: 0, carbs: 0, fat: 14, category: "condiment" },
  { name: "Ranch Dressing", serving: "2 tbsp", unit: "tablespoons (30ml)", calories: 129, protein: 0, carbs: 2, fat: 14, category: "condiment" },
  { name: "Italian Dressing", serving: "2 tbsp", unit: "tablespoons (30ml)", calories: 71, protein: 0, carbs: 3, fat: 7, category: "condiment" },
  { name: "Balsamic Vinaigrette", serving: "2 tbsp", unit: "tablespoons (30ml)", calories: 90, protein: 0, carbs: 6, fat: 7, category: "condiment" },
  { name: "Mayonnaise", serving: "1 tbsp", unit: "tablespoon (15g)", calories: 94, protein: 0, carbs: 0, fat: 10, category: "condiment" },
  { name: "Ketchup", serving: "1 tbsp", unit: "tablespoon (17g)", calories: 20, protein: 0, carbs: 5, fat: 0, category: "condiment" },
  { name: "Mustard", serving: "1 tsp", unit: "teaspoon (5g)", calories: 3, protein: 0, carbs: 0, fat: 0, category: "condiment" },
  { name: "Soy Sauce", serving: "1 tbsp", unit: "tablespoon (16ml)", calories: 11, protein: 1, carbs: 1, fat: 0, category: "condiment" },
  { name: "Honey", serving: "1 tbsp", unit: "tablespoon (21g)", calories: 64, protein: 0, carbs: 17, fat: 0, category: "condiment" },
  { name: "Maple Syrup", serving: "2 tbsp", unit: "tablespoons (40ml)", calories: 104, protein: 0, carbs: 27, fat: 0, category: "condiment" },
  { name: "BBQ Sauce", serving: "2 tbsp", unit: "tablespoons (36g)", calories: 52, protein: 0, carbs: 13, fat: 0, category: "condiment" },
  { name: "Hot Sauce", serving: "1 tsp", unit: "teaspoon (5ml)", calories: 0, protein: 0, carbs: 0, fat: 0, category: "condiment" },
  { name: "Sour Cream", serving: "2 tbsp", unit: "tablespoons (30g)", calories: 57, protein: 1, carbs: 1, fat: 6, category: "condiment" },
];

export function searchFoods(query: string, limit = 8): FoodItem[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  const scored = foodDatabase
    .map(item => {
      const name = item.name.toLowerCase();
      let score = 0;

      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 50;
      else if (words.every(w => name.includes(w))) score += 30;
      else if (words.some(w => name.includes(w))) score += 10;
      else return null;

      if (name.startsWith(words[0])) score += 15;

      const wordBoundaryMatches = words.filter(w => {
        const regex = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
        return regex.test(name);
      }).length;
      score += wordBoundaryMatches * 5;

      return { item, score };
    })
    .filter(Boolean) as { item: FoodItem; score: number }[];

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.item);
}
