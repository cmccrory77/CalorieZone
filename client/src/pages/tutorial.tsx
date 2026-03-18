import { Activity, Search, Camera, Barcode, Calendar, CalendarDays, ChefHat, Sparkles, Target, Star, Flame, Dumbbell, Wheat, Droplets, Plus, Check, ChevronRight, BarChart3, Apple, BookOpen, ShoppingCart, Zap, Info, ArrowLeft, Eye, Bookmark, Trash2, Filter } from "lucide-react";

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${color}`}>
      {children}
    </span>
  );
}

function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">{step}</div>
      <div className="flex-1">
        <h4 className="font-['Poppins',sans-serif] font-semibold text-slate-900 mb-2">{title}</h4>
        {children}
      </div>
    </div>
  );
}

function MockField({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="h-10 bg-white border-2 border-[#4CAF50]/40 rounded-lg px-3 flex items-center text-sm font-medium text-slate-700 relative">
        {value}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#4CAF50] animate-pulse rounded-full" />
      </div>
      {hint && <p className="text-[11px] text-slate-400 italic">{hint}</p>}
    </div>
  );
}

function MockButton({ color, children, size = "md" }: { color: string; children: React.ReactNode; size?: "sm" | "md" }) {
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <div className={`inline-flex items-center gap-1.5 ${pad} rounded-lg font-semibold text-white ${color} select-none`}>
      {children}
    </div>
  );
}

function Callout({ icon: Icon, color, title, children }: { icon: any; color: string; title: string; children: React.ReactNode }) {
  return (
    <div className={`flex gap-3 p-4 rounded-xl ${color}`}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-sm mb-0.5">{title}</p>
        <p className="text-sm leading-relaxed opacity-90">{children}</p>
      </div>
    </div>
  );
}

export default function Tutorial() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Inter',sans-serif] text-slate-900">
      <nav className="border-b border-slate-100 bg-white py-4 px-6 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="font-['Poppins',sans-serif] font-bold text-lg flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4CAF50] flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            CalorieZone
          </div>
          <a href="/" className="flex items-center gap-1 text-xs text-[#4CAF50] hover:underline font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to CalorieZone
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-16">

        {/* Hero */}
        <div className="text-center pt-2">
          <h1 className="font-['Poppins',sans-serif] text-3xl sm:text-4xl font-bold mb-3 leading-tight">How CalorieZone Works</h1>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">A step-by-step guide to tracking calories, planning meals, and reaching your weight goal.</p>
        </div>

        {/* ─── SECTION 0: Overview ─── */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-[#4CAF50] to-[#43A047] px-6 py-5">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-white" />
              <h2 className="font-['Poppins',sans-serif] text-xl font-bold text-white">What CalorieZone Does</h2>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-slate-600 leading-relaxed">CalorieZone calculates a personalized daily calorie target based on your body stats and goal, then helps you stay within it by logging everything you eat. The app is organized into three main areas:</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
                <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="font-semibold text-sm text-slate-800">Calorie Tracker</p>
                <p className="text-xs text-slate-500 mt-1">Log daily food and see your budget in real time</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold text-sm text-slate-800">Meal Planner</p>
                <p className="text-xs text-slate-500 mt-1">Plan the week ahead and build a grocery list</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center">
                <ChefHat className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="font-semibold text-sm text-slate-800">Recipes</p>
                <p className="text-xs text-slate-500 mt-1">AI-generated recipes with full nutrition info</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 1: Calorie Tracker ─── */}
        <section className="space-y-6">
          <div>
            <SectionLabel color="bg-orange-100 text-orange-700">
              <Flame className="h-3.5 w-3.5" /> Calorie Tracker
            </SectionLabel>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900">Daily Targets & Tracker</h2>
            <p className="text-slate-500 mt-1">This is the main card you'll use every day. It shows your calorie budget and tracks everything you eat.</p>
          </div>

          {/* What the display means */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">What the numbers mean</span>
            </div>
            <div className="p-5 space-y-5">
              {/* Mock calorie display */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">1,840</div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">Target</div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#FF9800] to-[#FF9800]/80 rounded-full" style={{ width: "58%" }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-400">0</span>
                      <span className="text-[10px] font-semibold text-[#FF9800]">1,070 eaten</span>
                      <span className="text-[10px] text-slate-400">1,840</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#4CAF50]">770</div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">Remaining</div>
                  </div>
                </div>
                {/* Macros */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-white rounded-lg p-2.5 text-center border border-blue-100">
                    <div className="text-sm font-bold text-blue-600">82g</div>
                    <div className="text-[10px] text-slate-400">Protein</div>
                    <div className="mt-1 h-1 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 text-center border border-emerald-100">
                    <div className="text-sm font-bold text-emerald-600">94g</div>
                    <div className="text-[10px] text-slate-400">Carbs</div>
                    <div className="mt-1 h-1 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "47%" }} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 text-center border border-amber-100">
                    <div className="text-sm font-bold text-amber-600">38g</div>
                    <div className="text-[10px] text-slate-400">Fat</div>
                    <div className="mt-1 h-1 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "50%" }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Target</p>
                    <p className="text-slate-500 text-xs leading-relaxed">Your personalized daily calorie budget, calculated from your weight, goal, and activity level.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <BarChart3 className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Remaining</p>
                    <p className="text-slate-500 text-xs leading-relaxed">Calories left to eat today. Goes green when on track, turns red if you exceed your budget.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Dumbbell className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Protein (P)</p>
                    <p className="text-slate-500 text-xs leading-relaxed">Grams of protein eaten. The bar shows how close you are to your daily protein target.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Wheat className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Carbs (C) & Fat (F)</p>
                    <p className="text-slate-500 text-xs leading-relaxed">Grams of carbohydrates and fat. Each bar fills as you log food throughout the day.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How to log food */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Plus className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">How to log food</span>
            </div>
            <div className="p-5 space-y-6">
              <StepCard step={1} title="Search for a food">
                <p className="text-slate-500 text-sm leading-relaxed mb-3">Tap the search field and start typing any food name. Results appear instantly from a built-in database. Foods you've logged before appear at the top when the field is empty.</p>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <div className="h-9 bg-white border border-slate-200 rounded-lg pl-8 flex items-center text-sm text-slate-400">Search food (e.g. chicken, banana...)</div>
                  </div>
                  {/* Dropdown mockup */}
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden text-sm shadow-sm">
                    <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Recent & Frequent</span>
                    </div>
                    {[
                      { name: "Chicken Breast", cal: 165, freq: "4x logged" },
                      { name: "Brown Rice", cal: 215, freq: "3x logged" },
                      { name: "Greek Yogurt", cal: 130, freq: "2x logged" },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-3 px-3 py-2.5 border-b border-slate-50 last:border-0 ${i === 0 ? "bg-primary/5" : ""}`}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${i === 0 ? "bg-[#4CAF50] border-[#4CAF50]" : "border-slate-300"}`}>
                          {i === 0 && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-slate-800">{item.name}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">{item.freq}</div>
                        </div>
                        <span className="text-xs font-bold text-[#FF9800]">{item.cal}</span>
                      </div>
                    ))}
                    {/* Add selected bar */}
                    <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">1 selected · <span className="font-semibold text-[#FF9800]">165 cal</span></span>
                      <MockButton color="bg-[#4CAF50]" size="sm"><Plus className="h-3 w-3" />Add 1</MockButton>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 italic pl-1">Tap checkboxes to select multiple recent items and add them all at once. Or type to search the full database.</p>
                </div>
              </StepCard>

              <StepCard step={2} title="Set the serving size">
                <p className="text-slate-500 text-sm leading-relaxed mb-3">After tapping a food from the search results, a serving selector appears. Use the <span className="font-semibold text-slate-700">−</span> and <span className="font-semibold text-slate-700">+</span> buttons to change the quantity, or type it directly. Calories and macros update instantly.</p>
                <div className="bg-slate-800 rounded-xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Chicken Breast</p>
                      <p className="text-xs text-slate-400">100g serving</p>
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center text-slate-400">✕</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-700 rounded-lg border border-slate-600">
                      <div className="w-8 h-8 flex items-center justify-center text-slate-300 text-sm">−</div>
                      <div className="w-14 h-8 text-center text-sm font-bold text-white border-x border-slate-600 flex items-center justify-center">1.5</div>
                      <div className="w-8 h-8 flex items-center justify-center text-slate-300 text-sm">+</div>
                    </div>
                    <span className="text-xs text-slate-400">× 100g serving</span>
                    <div className="flex-1" />
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#FF9800]">248</span>
                      <span className="text-xs text-slate-400 ml-1">kcal</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-[11px] text-slate-400">
                      <span>P: <b className="text-blue-400">55g</b></span>
                      <span>C: <b className="text-emerald-400">0g</b></span>
                      <span>F: <b className="text-amber-400">8g</b></span>
                    </div>
                    <MockButton color="bg-[#FF9800]" size="sm"><Check className="h-3 w-3" />Add</MockButton>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic mt-2 pl-1">The dark background makes the quantity number easy to read. Tap <span className="font-semibold">Add</span> to log it.</p>
              </StepCard>

              <StepCard step={3} title="Or scan with your camera (Pro)">
                <p className="text-slate-500 text-sm leading-relaxed mb-3">Tap one of the two scan buttons above the search field to log food even faster:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-[#4CAF50]/10 border border-[#4CAF50]/20 flex items-center justify-center shrink-0">
                      <Barcode className="h-4 w-4 text-[#4CAF50]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Barcode Scanner</p>
                      <p className="text-xs text-slate-500 leading-relaxed">Point your camera at any packaged food barcode. The nutrition label is read automatically.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-[#FF9800]/10 border border-[#FF9800]/20 flex items-center justify-center shrink-0">
                      <Camera className="h-4 w-4 text-[#FF9800]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">AI Meal Scanner</p>
                      <p className="text-xs text-slate-500 leading-relaxed">Take a photo of any meal — a plate of food, a bowl, a snack. The AI identifies each component and estimates calories and macros.</p>
                    </div>
                  </div>
                </div>
              </StepCard>

              <StepCard step={4} title="How logged food affects your targets">
                <p className="text-slate-500 text-sm leading-relaxed mb-3">Every time you add a food, the tracker card updates immediately:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[10px] font-bold text-orange-600">↑</span></div>
                    <p className="text-slate-600">The <span className="font-semibold text-slate-800">Eaten</span> number increases by the calories of the item you added.</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[10px] font-bold text-green-600">↓</span></div>
                    <p className="text-slate-600">The <span className="font-semibold text-slate-800">Remaining</span> number decreases. When it reaches zero you've hit your budget.</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[10px] font-bold text-blue-600">→</span></div>
                    <p className="text-slate-600">The <span className="font-semibold text-slate-800">Protein, Carbs, and Fat</span> bars fill toward their targets based on the food's macros.</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[10px] font-bold text-purple-600">✓</span></div>
                    <p className="text-slate-600">The food appears in your <span className="font-semibold text-slate-800">food log</span> below the tracker. You can swipe or tap to delete any entry.</p>
                  </div>
                </div>
              </StepCard>
            </div>
          </div>

          {/* Weight tracking */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Target className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">Updating your weight & goal</span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-500 text-sm leading-relaxed">At the top of the screen you'll see your current <span className="font-semibold text-slate-700">Weight</span> and <span className="font-semibold text-slate-700">Goal</span> alongside a progress bar. These are always one tap away.</p>
              {/* Mock weight bar */}
              <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 flex items-center gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Weight</span>
                  <div className="font-bold text-[11px] text-slate-800 border border-slate-200 rounded px-1 py-0.5 bg-white">187</div>
                  <span className="text-[9px] text-slate-400">lbs</span>
                </div>
                <span className="text-slate-200">|</span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Goal</span>
                  <div className="font-bold text-[11px] text-[#4CAF50] border border-[#4CAF50]/30 rounded px-1 py-0.5 bg-[#4CAF50]/5">165</div>
                  <span className="text-[9px] text-slate-400">lbs</span>
                </div>
                <span className="text-slate-200">|</span>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#4CAF50] to-[#4CAF50]/70 rounded-full" style={{ width: "35%" }} />
                  </div>
                  <span className="text-[9px] font-bold text-[#4CAF50]">35%</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex gap-2 items-start p-3 bg-slate-50 rounded-lg">
                  <span className="text-base">✏️</span>
                  <p className="text-slate-600 text-xs leading-relaxed"><span className="font-semibold text-slate-800">Tap the Weight number</span> to type your updated weight. Press Enter or tap away to save. Your calorie target adjusts automatically.</p>
                </div>
                <div className="flex gap-2 items-start p-3 bg-slate-50 rounded-lg">
                  <span className="text-base">🎯</span>
                  <p className="text-slate-600 text-xs leading-relaxed"><span className="font-semibold text-slate-800">Tap the Goal number</span> to change your target weight. The progress percentage and calorie target will update to reflect the new goal.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 2: Meal Planner ─── */}
        <section className="space-y-6">
          <div>
            <SectionLabel color="bg-blue-100 text-blue-700">
              <Calendar className="h-3.5 w-3.5" /> Meal Planner
            </SectionLabel>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900">Plan Your Week</h2>
            <p className="text-slate-500 mt-1">Available with Pro. The Meal Planner generates a full 7-day meal plan tailored to your calorie target and preferences — in one tap.</p>
          </div>

          {/* What it shows */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">What the Meal Planner card shows</span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-500 text-sm leading-relaxed">The Meal Planner card has two parts: a <span className="font-semibold text-slate-700">week strip</span> showing all 7 days at a glance, and a <span className="font-semibold text-slate-700">Today's Meals</span> list showing what's planned for today.</p>

              {/* Mock week strip */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">This Week</p>
                <div className="flex gap-1.5">
                  {["M","T","W","T","F","S","S"].map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] text-slate-400 font-medium">{d}</span>
                      <div className={`w-full h-5 rounded ${i < 4 ? (i === 1 ? "bg-primary/70 ring-2 ring-primary/30" : "bg-primary/40") : "bg-slate-200"} flex items-center justify-center`}>
                        {i < 4 && i !== 1 && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5 pt-1">
                  {[
                    { type: "Breakfast", name: "Oatmeal with Berries", cal: 340, color: "bg-amber-100 text-amber-600" },
                    { type: "Lunch", name: "Grilled Chicken Salad", cal: 480, color: "bg-blue-100 text-blue-600" },
                    { type: "Dinner", name: "Salmon & Vegetables", cal: 520, color: "bg-purple-100 text-purple-600" },
                  ].map((meal, i) => (
                    <div key={i} className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-100">
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-[9px] font-bold ${meal.color}`}>{meal.type[0]}</div>
                      <span className="text-[11px] font-medium text-slate-700 flex-1 truncate">{meal.name}</span>
                      <span className="text-[10px] font-semibold text-slate-400 shrink-0">{meal.cal}</span>
                      <div className="flex gap-1 shrink-0">
                        <div className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center"><Eye className="h-2.5 w-2.5 text-slate-400" /></div>
                        <div className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center"><Plus className="h-2.5 w-2.5 text-slate-400" /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><Calendar className="h-3.5 w-3.5 text-blue-500" /></div>
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">Week strip</p>
                    <p className="text-slate-500 text-xs leading-relaxed mt-0.5">Each dot represents a day. A filled dot means meals are planned. Today's dot is highlighted. Past days with completed meals show a checkmark.</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0"><Check className="h-3.5 w-3.5 text-green-600" /></div>
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">Today's Meals list</p>
                    <p className="text-slate-500 text-xs leading-relaxed mt-0.5">Shows all meals planned for today. Each meal has a calorie count, a view button, and a log button. Once logged, the meal shows a green checkmark.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Configure */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Plus className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">Step 1 — Configure your plan</span>
            </div>
            <div className="p-5 space-y-5">
              <p className="text-slate-500 text-sm leading-relaxed">Before generating, set your preferences using the three sections at the bottom of the Meal Planner card.</p>

              {/* Include Meals */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">A</div>
                  <h4 className="font-semibold text-slate-800 text-sm">Include Meals</h4>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed pl-8">Choose which meal types to include in the generated plan. Tap any combination of Breakfast, Lunch, Dinner, and Snacks. At least one must be selected before you can generate.</p>
                <div className="pl-8">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Breakfast", color: "border-amber-200 bg-amber-50 text-amber-700" },
                      { label: "Lunch", color: "border-blue-200 bg-blue-50 text-blue-700" },
                      { label: "Dinner", color: "border-purple-200 bg-purple-50 text-purple-700" },
                      { label: "Snacks", color: "border-green-200 bg-green-50 text-green-700" },
                    ].map(item => (
                      <div key={item.label} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${item.color}`}>
                        <div className="w-3.5 h-3.5 rounded border-2 border-current flex items-center justify-center shrink-0">
                          <Check className="h-2 w-2" />
                        </div>
                        {item.label}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 italic mt-2">If Snacks is enabled, you can also choose how many snacks per day (1, 2, or 3).</p>
                </div>
              </div>

              {/* Meal Preference */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">B</div>
                  <h4 className="font-semibold text-slate-800 text-sm">Meal Preference</h4>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed pl-8">Select your dietary style. Only one can be active at a time. This tells the AI what kind of meals to generate.</p>
                <div className="pl-8 grid grid-cols-2 gap-2">
                  {[
                    { label: "Balanced", desc: "Varied, everyday meals with a mix of all macros" },
                    { label: "High Protein", desc: "Meals optimised for protein — ideal for muscle gain" },
                    { label: "Keto", desc: "Low carb, high fat meals" },
                    { label: "Vegetarian", desc: "No meat. Dairy and eggs may be included" },
                  ].map((opt, i) => (
                    <div key={opt.label} className={`p-2.5 rounded-lg border text-xs ${i === 0 ? "border-[#4CAF50] bg-[#4CAF50]/5 text-[#4CAF50] font-semibold" : "border-slate-200 text-slate-600"}`}>
                      <p className="font-semibold">{opt.label}</p>
                      <p className={`text-[10px] mt-0.5 ${i === 0 ? "text-[#4CAF50]/70" : "text-slate-400"}`}>{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Include My Recipes */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">C</div>
                  <h4 className="font-semibold text-slate-800 text-sm">Include My Recipes</h4>
                </div>
                <div className="pl-8 space-y-2">
                  <p className="text-slate-500 text-sm leading-relaxed">When enabled, the AI will use meals from your <span className="font-semibold text-slate-700">Saved Recipes</span> library when building your week plan, instead of generating entirely new ones.</p>
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Only available when you have saved recipes</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">If you haven't saved any recipes yet, this option is greyed out. Generate and save recipes first in the Recipes section, then enable this to include them in your plan.</p>
                    </div>
                  </div>
                  <Callout icon={Zap} color="bg-amber-50 text-amber-800 border border-amber-100" title="How it works">
                    With "Include My Recipes" on, the AI picks meals from your saved recipes that match your calorie target and selected meal types. It's a great way to reuse meals you already enjoy.
                  </Callout>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Generate */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Zap className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">Step 2 — Generate your week plan</span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-500 text-sm leading-relaxed">Once your settings are configured, tap <span className="font-semibold text-slate-700">Generate Week Plan</span>. The AI creates 7 days of meals in seconds, each day balanced to stay within your daily calorie target.</p>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-2">
                <div className="w-full h-10 bg-[#4CAF50] rounded-lg flex items-center justify-center gap-2">
                  <CalendarDays className="h-4 w-4 text-white" />
                  <span className="text-sm font-semibold text-white">Generate Week Plan</span>
                </div>
                <p className="text-[11px] text-slate-400 text-center italic">If you already have a plan, this button says "Regenerate Week Plan" — tapping it replaces the existing plan with a fresh one.</p>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">After generating, the plan appears in the <span className="font-semibold text-slate-700">Meal Plan</span> tab inside the Recipes section below the planner card.</p>
            </div>
          </div>

          {/* Step 3: View & Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Eye className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">Step 3 — View recipes and log meals</span>
            </div>
            <div className="p-5 space-y-5">
              <StepCard step={1} title="Log a meal for today">
                <p className="text-slate-500 text-sm leading-relaxed mb-3">Today's meals appear in the <span className="font-semibold text-slate-700">Today's Meals</span> list on the Meal Planner card. Each row has two buttons:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-7 h-7 rounded border border-slate-300 flex items-center justify-center shrink-0 bg-white">
                      <Eye className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">View button</p>
                      <p className="text-xs text-slate-500 mt-0.5">Opens the full recipe — ingredients, instructions, and the complete nutrition breakdown.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-7 h-7 rounded border border-[#4CAF50]/40 flex items-center justify-center shrink-0 bg-[#4CAF50]/5">
                      <Plus className="h-3.5 w-3.5 text-[#4CAF50]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Log button</p>
                      <p className="text-xs text-slate-500 mt-0.5">Adds the meal's calories and macros directly to today's food diary. The button turns into a green checkmark once logged so you always know what's been eaten.</p>
                    </div>
                  </div>
                </div>
              </StepCard>

              <StepCard step={2} title="View meals for other days">
                <p className="text-slate-500 text-sm leading-relaxed mb-2">Tap <span className="font-semibold text-slate-700">View Full Week Plan</span> at the bottom of the planner card. This takes you to the <span className="font-semibold text-slate-700">Meal Plan tab</span> in the Recipes section where you can browse all 7 days. Tap any day to see its meals and view the recipes for that day.</p>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                  <div className="w-full h-9 bg-[#4CAF50] rounded-lg flex items-center justify-center gap-2 mb-2">
                    <CalendarDays className="h-3.5 w-3.5 text-white" />
                    <span className="text-xs font-semibold text-white">View Full Week Plan</span>
                    <ChevronRight className="h-3.5 w-3.5 text-white" />
                  </div>
                  <p className="text-[11px] text-slate-400 text-center italic">This scrolls you to the Meal Plan tab automatically.</p>
                </div>
              </StepCard>

              <StepCard step={3} title="Generate a grocery list">
                <p className="text-slate-500 text-sm leading-relaxed mb-2">Once a plan exists, tap <span className="font-semibold text-slate-700">Grocery List</span>. The app compiles every ingredient from all 7 days into a single shareable list. Tap <span className="font-semibold text-slate-700">Share</span> to send it to Apple Notes — then select all items and tap the Checklist button in Notes to make each item tappable.</p>
                <Callout icon={Zap} color="bg-amber-50 text-amber-800 border border-amber-100" title="Pro tip">
                  Generate your plan on Sunday, tap Grocery List, share it to Apple Notes, and shop once for the whole week.
                </Callout>
              </StepCard>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: Recipes ─── */}
        <section className="space-y-6">
          <div>
            <SectionLabel color="bg-purple-100 text-purple-700">
              <ChefHat className="h-3.5 w-3.5" /> Recipes
            </SectionLabel>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900">Recipes</h2>
            <p className="text-slate-500 mt-1">Available with Pro. Browse pre-built meal suggestions, generate your own AI recipes, and build a library of favourites — all tailored to your calorie target.</p>
          </div>

          {/* Overview: Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">The Recipes section has four tabs</span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Recommended", color: "bg-purple-100 text-purple-700", desc: "Pre-built meals matched to your daily calorie target. These refresh each day." },
                { label: "Meal Plan", color: "bg-blue-100 text-blue-700", desc: "Appears when you have a generated week plan. Shows all 7 days of planned meals." },
                { label: "Recipe Generator", color: "bg-indigo-100 text-indigo-700", desc: "Build a custom recipe using simple dropdowns and optional ingredients." },
                { label: "My Recipes", color: "bg-emerald-100 text-emerald-700", desc: "Your personal library. Every recipe you generate is saved here automatically." },
              ].map(tab => (
                <div key={tab.label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${tab.color}`}>{tab.label}</span>
                  <p className="text-sm text-slate-500 leading-relaxed">{tab.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Tab */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Star className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">Recommended tab</span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-500 text-sm leading-relaxed">The Recommended tab shows a grid of meal cards — each one portioned to fit your daily calorie budget. Use the meal-type filter at the top to narrow by Breakfast, Lunch, Dinner, or Snacks.</p>
              {/* Mock recommended card */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                <div className="h-24 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center relative">
                  <span className="absolute top-2 left-2 bg-white/90 text-[10px] font-bold text-[#4CAF50] px-2 py-0.5 rounded-full">Best Match</span>
                  <ChefHat className="h-10 w-10 text-emerald-400" />
                </div>
                <div className="p-3 space-y-2">
                  <p className="font-semibold text-sm text-slate-800">Herb Chicken & Roasted Veg</p>
                  <div className="flex gap-3 text-xs">
                    <span className="font-bold text-slate-700">480 <span className="font-normal text-slate-400">cal</span></span>
                    <span className="text-slate-400">·</span>
                    <span className="font-medium text-blue-600">42g <span className="text-slate-400 font-normal">protein</span></span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">20 min</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <div className="flex-1 h-8 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-600">View Recipe</div>
                    <div className="h-8 px-3 bg-[#4CAF50] rounded-lg flex items-center justify-center gap-1 text-[11px] font-semibold text-white"><Plus className="h-3 w-3" />Log</div>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-7 h-7 rounded border border-slate-200 bg-white flex items-center justify-center shrink-0"><Eye className="h-3.5 w-3.5 text-slate-500" /></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">View Recipe</p>
                    <p className="text-xs text-slate-500 mt-0.5">Opens the full recipe with ingredients, step-by-step instructions, and the complete nutrition breakdown.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-7 h-7 rounded border border-[#4CAF50]/30 bg-[#4CAF50]/5 flex items-center justify-center shrink-0"><Plus className="h-3.5 w-3.5 text-[#4CAF50]" /></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Log</p>
                    <p className="text-xs text-slate-500 mt-0.5">Adds the meal's calories and macros to today's food diary instantly. No need to search or enter anything manually.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Generator Tab */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">Recipe Generator tab</span>
            </div>
            <div className="p-5 space-y-5">
              <p className="text-slate-500 text-sm leading-relaxed">The Recipe Generator creates a custom recipe from scratch using four simple fields. Calories are automatically calculated based on your daily target.</p>

              <StepCard step={1} title="Set your options">
                <p className="text-slate-500 text-sm leading-relaxed mb-3">Fill in the four fields to describe what you want:</p>
                {/* Mock generator form */}
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3.5 space-y-3">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Protein Source</p>
                    <div className="h-9 bg-white rounded-lg border border-slate-200 px-3 flex items-center justify-between text-sm text-slate-700">
                      <span>Chicken</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 rotate-90" />
                    </div>
                    <p className="text-[10px] text-slate-400 italic">Choose from Chicken, Fish, Beef, or Vegetarian.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Meal Preference</p>
                    <div className="h-9 bg-white rounded-lg border border-slate-200 px-3 flex items-center justify-between text-sm text-slate-700">
                      <span>High Protein</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 rotate-90" />
                    </div>
                    <p className="text-[10px] text-slate-400 italic">Balanced, High Protein, Keto, or Vegetarian.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Servings</p>
                    <div className="h-9 bg-white rounded-lg border border-slate-200 px-3 flex items-center justify-between text-sm text-slate-700">
                      <span>2</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 rotate-90" />
                    </div>
                    <p className="text-[10px] text-slate-400 italic">Pick 1–6 servings. Ingredient amounts and calories scale accordingly.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Extra Ingredients <span className="normal-case font-normal">(optional)</span></p>
                    <div className="h-9 bg-white rounded-lg border border-slate-200 px-3 flex items-center text-sm text-slate-400 italic">
                      e.g. broccoli, rice, bell peppers...
                    </div>
                    <p className="text-[10px] text-slate-400 italic">Type any additional ingredients, separated by a comma. The recipe will include them.</p>
                  </div>
                </div>
              </StepCard>

              <StepCard step={2} title="Generate your recipe">
                <p className="text-slate-500 text-sm leading-relaxed mb-3">Tap <span className="font-semibold text-slate-700">Generate Recipe</span>. In a moment a result card appears below showing the recipe name, cooking time, servings tag, and the full nutrition breakdown:</p>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2 servings</span>
                    <span className="bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">High Protein</span>
                  </div>
                  <p className="font-bold text-sm text-slate-800">Zesty Chicken Skillet</p>
                  <p className="text-[11px] text-slate-500">Dinner · High Protein · 20 min</p>
                  <div className="flex gap-2">
                    {[["480","kcal","orange"],["54g","protein","blue"],["22g","carbs","emerald"],["16g","fat","amber"]].map(([v,l,c]) => (
                      <div key={l} className={`bg-${c}-50 border border-${c}-100 rounded-lg px-2 py-1.5 text-center`}>
                        <div className={`text-sm font-bold text-${c}-600`}>{v}</div>
                        <div className="text-[9px] text-slate-400">{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <div className="flex-1 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-600">View Recipe</div>
                    <div className="h-8 px-3 bg-[#4CAF50] rounded-lg flex items-center gap-1 text-[11px] font-semibold text-white"><Plus className="h-3 w-3" />Log</div>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-7 h-7 rounded border border-slate-200 bg-white flex items-center justify-center shrink-0"><Eye className="h-3.5 w-3.5 text-slate-500" /></div>
                    <p className="text-xs text-slate-600 leading-relaxed"><span className="font-semibold text-slate-800">View Recipe</span> — Opens the full recipe with a complete ingredient list and step-by-step cooking instructions.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-7 h-7 rounded border border-[#4CAF50]/30 bg-[#4CAF50]/5 flex items-center justify-center shrink-0"><Plus className="h-3.5 w-3.5 text-[#4CAF50]" /></div>
                    <p className="text-xs text-slate-600 leading-relaxed"><span className="font-semibold text-slate-800">Log</span> — Adds the recipe's calories and macros to today's food diary immediately.</p>
                  </div>
                </div>
              </StepCard>

              <StepCard step={3} title="Recipes are saved automatically">
                <p className="text-slate-500 text-sm leading-relaxed mb-2">Every recipe you generate is <span className="font-semibold text-slate-700">automatically added to My Recipes</span> — there is no separate save button. As soon as the result card appears, the recipe is already in your library.</p>
                <Callout icon={Bookmark} color="bg-purple-50 text-purple-800 border border-purple-100" title="No need to save manually">
                  Just generate and go. Your recipes accumulate in My Recipes so you can reuse them or include them in your Meal Plan later.
                </Callout>
              </StepCard>
            </div>
          </div>

          {/* My Recipes Tab */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">My Recipes tab</span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-500 text-sm leading-relaxed">My Recipes is your personal recipe library. Every recipe you've generated appears here as a compact row.</p>
              {/* Mock saved recipe rows */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-2">
                {[
                  { name: "Zesty Chicken Skillet", cal: 480 },
                  { name: "Golden Fish Bowl", cal: 420 },
                  { name: "Roasted Beef Skillet", cal: 510 },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-emerald-100">
                      <ChefHat className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate text-slate-700">{r.name}</p>
                      <p className="text-[10px] text-slate-400">{r.cal} cal</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center"><Eye className="h-3 w-3 text-slate-400" /></div>
                      <div className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center"><Trash2 className="h-3 w-3 text-slate-400" /></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-7 h-7 rounded border border-slate-200 bg-white flex items-center justify-center shrink-0"><Eye className="h-3.5 w-3.5 text-slate-500" /></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">View button</p>
                    <p className="text-xs text-slate-500 mt-0.5">Opens the full recipe — ingredients, instructions, and nutrition. You can also log it to today's diary from inside the recipe view.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-7 h-7 rounded border border-red-200 bg-red-50 flex items-center justify-center shrink-0"><Trash2 className="h-3.5 w-3.5 text-red-400" /></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Remove button</p>
                    <p className="text-xs text-slate-500 mt-0.5">Permanently removes the recipe from your library. This cannot be undone — generate it again if you need it back.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Free vs Pro ─── */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 flex items-center gap-3">
            <Star className="h-5 w-5 text-amber-400" />
            <h2 className="font-['Poppins',sans-serif] text-xl font-bold text-white">Free vs. Pro</h2>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-['Poppins',sans-serif] font-bold text-sm text-slate-700 mb-3">Free</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {["Food search & manual logging", "Recent & frequent food suggestions", "Daily calorie tracking", "Macro tracking (P / C / F)", "Weight & goal progress"].map(f => (
                    <li key={f} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#4CAF50] shrink-0" />{f}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="font-['Poppins',sans-serif] font-bold text-sm text-amber-700 mb-3">Pro</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {["Everything in Free", "AI Meal Scanner (photo → calories)", "Barcode Scanner", "Meal Planner & Grocery List", "AI Recipe Generator", "Saved Recipes"].map(f => (
                    <li key={f} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-amber-500 shrink-0" />{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-slate-100 py-6 px-6 mt-4">
        <div className="max-w-3xl mx-auto text-center text-xs text-slate-400">
          © {new Date().getFullYear()} CalorieZone. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
