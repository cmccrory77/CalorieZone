import { Activity, Search, Camera, Barcode, UtensilsCrossed, Calendar, ChefHat, Sparkles, Target, User, ArrowLeft, Star } from "lucide-react";

export default function Tutorial() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-slate-900">
      <nav className="border-b border-slate-100 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="font-['Poppins',sans-serif] font-bold text-lg flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4CAF50] flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            CalorieZone
          </a>
          <a href="/app" className="text-sm text-[#4CAF50] hover:underline flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to App
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-['Poppins',sans-serif] text-4xl font-bold mb-3">How to Use CalorieZone</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Your personal weight management companion — track calories, plan meals, and reach your goals with ease.</p>
        </div>

        <div className="mb-12 p-6 bg-[#4CAF50]/5 rounded-2xl border border-[#4CAF50]/10">
          <h2 className="font-['Poppins',sans-serif] text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#4CAF50]" />
            What CalorieZone Does
          </h2>
          <p className="text-slate-600 leading-relaxed">
            CalorieZone helps you manage your weight by tracking what you eat each day. Set your current weight and goal weight, and the app calculates a personalized daily calorie target. Log your meals, scan food with your camera, plan your week, and generate AI-powered recipes — all in one place.
          </p>
        </div>

        <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-6">Getting Started</h2>

        <div className="space-y-6 mb-12">
          <div className="flex gap-4 items-start p-5 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Create Your Profile</h3>
              <p className="text-slate-600 text-sm leading-relaxed">When you first open the app, you'll enter your name, starting weight, current weight, and goal weight. Choose your activity level so the app can calculate the right daily calorie target for you.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-5 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Set a Timeline</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Pick a target date for reaching your goal weight. The app adjusts your daily calories based on how quickly or gradually you want to lose weight.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-5 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Start Tracking</h3>
              <p className="text-slate-600 text-sm leading-relaxed">You're all set! Log your meals throughout the day and watch your progress as you work toward your target.</p>
            </div>
          </div>
        </div>

        <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-6">App Features</h2>

        <div className="grid gap-5 sm:grid-cols-2 mb-12">
          <div className="p-5 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-5 w-5 text-[#FF9800]" />
              <h3 className="font-semibold text-slate-900">Food Search & Logging</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">Search from a built-in database of common foods. Tap any result to add it to your daily log. You can also type a custom food name and enter the calories manually.</p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed className="h-5 w-5 text-[#FF9800]" />
              <h3 className="font-semibold text-slate-900">Quick Add</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">Foods you log frequently appear in the Quick Add section. Select one or more items and add them to your diary in one tap — great for meals you eat often.</p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-5 w-5 text-[#4CAF50]" />
              <h3 className="font-semibold text-slate-900">AI Meal Scanner</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">Take a photo of your meal and the AI identifies the food, estimates portion sizes, and calculates calories and macros automatically. Available with Pro.</p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Barcode className="h-5 w-5 text-[#4CAF50]" />
              <h3 className="font-semibold text-slate-900">Barcode Scanner</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">Scan the barcode on any packaged food to instantly pull up its nutrition info. The data comes directly from manufacturer labels for accuracy.</p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-[#2196F3]" />
              <h3 className="font-semibold text-slate-900">Meal Planner</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">Plan your meals for the week ahead. Add meals to specific days, see your weekly calorie overview, and generate a grocery list you can share to Apple Notes. Available with Pro.</p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <ChefHat className="h-5 w-5 text-[#2196F3]" />
              <h3 className="font-semibold text-slate-900">AI Recipe Generator</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">Tell the AI what you'd like to eat or what ingredients you have, and it generates a full recipe with step-by-step instructions, nutrition breakdown, and calorie count. Available with Pro.</p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-[#9C27B0]" />
              <h3 className="font-semibold text-slate-900">Saved Recipes</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">Save your favorite AI-generated recipes for later. Quickly log a saved recipe to your food diary without re-generating it.</p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-[#9C27B0]" />
              <h3 className="font-semibold text-slate-900">Profile & Progress</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">View your progress percentage, update your current weight anytime, and adjust your goal. Your weight and goal are always visible at the top of the app for quick edits.</p>
          </div>
        </div>

        <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 mb-6">Daily Flow</h2>

        <div className="space-y-4 mb-12">
          <div className="flex gap-3 items-start">
            <div className="w-2 h-2 rounded-full bg-[#4CAF50] mt-2 shrink-0" />
            <p className="text-slate-600 leading-relaxed"><span className="font-semibold text-slate-900">Morning:</span> Open the app and check your daily calorie budget. Log breakfast by searching for foods or scanning your meal.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-2 h-2 rounded-full bg-[#FF9800] mt-2 shrink-0" />
            <p className="text-slate-600 leading-relaxed"><span className="font-semibold text-slate-900">Throughout the day:</span> Log lunch, dinner, and snacks as you eat. Use Quick Add for repeat meals. The calorie ring updates in real time.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-2 h-2 rounded-full bg-[#2196F3] mt-2 shrink-0" />
            <p className="text-slate-600 leading-relaxed"><span className="font-semibold text-slate-900">Planning ahead:</span> Use the Meal Planner to map out tomorrow or the whole week. Generate a grocery list and share it to your notes app.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-2 h-2 rounded-full bg-[#9C27B0] mt-2 shrink-0" />
            <p className="text-slate-600 leading-relaxed"><span className="font-semibold text-slate-900">Weigh-ins:</span> Tap your weight at the top of the screen to update it anytime. Watch your progress percentage climb toward your goal.</p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 mb-12">
          <h2 className="font-['Poppins',sans-serif] text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-[#FF9800]" />
            Free vs. Pro
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Free</h4>
              <ul className="space-y-1.5 text-slate-600">
                <li>• Food search & manual logging</li>
                <li>• Quick Add frequent foods</li>
                <li>• Daily calorie tracking</li>
                <li>• Weight progress tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Pro</h4>
              <ul className="space-y-1.5 text-slate-600">
                <li>• Everything in Free</li>
                <li>• AI Meal Scanner</li>
                <li>• Barcode Scanner</li>
                <li>• Meal Planner & Grocery List</li>
                <li>• AI Recipe Generator</li>
                <li>• Saved Recipes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a href="/app" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4CAF50] text-white font-semibold rounded-xl hover:bg-[#43A047] transition-colors">
            Open CalorieZone
          </a>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-6 px-6 mt-8">
        <div className="max-w-4xl mx-auto text-center text-xs text-slate-400">
          © {new Date().getFullYear()} CalorieZone. All rights reserved.
        </div>
      </footer>
    </div>
  );
}