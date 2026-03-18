import { Activity, Search, Camera, Barcode, Calendar, ChefHat, Sparkles, Target, Star, Flame, Dumbbell, Wheat, Droplets, Plus, Check, ChevronRight, BarChart3, Apple, BookOpen, ShoppingCart, Zap, Info, ArrowLeft } from "lucide-react";

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
            <p className="text-slate-500 mt-1">Available with Pro. Map out meals for the week ahead so you stay on track before you get hungry.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">What the Meal Planner shows</span>
            </div>
            <div className="p-5 space-y-5">
              {/* Mock planner */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                  {["Mon", "Tue", "Wed"].map((day, i) => (
                    <div key={day} className="p-2">
                      <div className={`text-[11px] font-bold text-center mb-1.5 ${i === 0 ? "text-blue-600" : "text-slate-500"}`}>{day}</div>
                      {i === 0 ? (
                        <div className="space-y-1">
                          <div className="bg-white rounded px-2 py-1 text-[10px] font-medium text-slate-700 border border-blue-100">Oatmeal · 320 cal</div>
                          <div className="bg-white rounded px-2 py-1 text-[10px] font-medium text-slate-700 border border-blue-100">Grilled Chicken · 480 cal</div>
                          <div className="text-[10px] font-bold text-blue-600 text-center mt-1">800 cal</div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-16 border-2 border-dashed border-slate-200 rounded text-[10px] text-slate-300">+ Add meal</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Weekly total: <span className="font-semibold text-slate-700">800 / 12,880 cal</span></span>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-600">
                    <ShoppingCart className="h-3 w-3" /> Grocery List
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <StepCard step={1} title="Add a meal to a day">
                  <p className="text-slate-500 text-sm leading-relaxed">Tap the <span className="font-semibold text-slate-700">+ Add Meal</span> button inside any day column. A panel opens where you can search for a food or choose from your saved recipes. Select a meal and tap <span className="font-semibold text-slate-700">Add to Plan</span>.</p>
                </StepCard>
                <StepCard step={2} title="See your weekly calorie picture">
                  <p className="text-slate-500 text-sm leading-relaxed">Each day column shows the total planned calories for that day. The weekly summary at the bottom shows how your plan compares to your 7-day calorie budget. Days close to your target show in green; over-budget days highlight in amber.</p>
                </StepCard>
                <StepCard step={3} title="Generate a grocery list">
                  <p className="text-slate-500 text-sm leading-relaxed mb-2">Tap the <span className="font-semibold text-slate-700">Grocery List</span> button. The app compiles every ingredient from your planned meals into a single list. Tap <span className="font-semibold text-slate-700">Share</span> to send it to Apple Notes — then select all items and tap the Checklist button in Notes to make each item tappable.</p>
                  <Callout icon={Zap} color="bg-amber-50 text-amber-800 border border-amber-100" title="Pro tip">
                    Plan the entire week on Sunday, generate the grocery list, and shop once. You'll always have the right ingredients on hand.
                  </Callout>
                </StepCard>
                <StepCard step={4} title="Log a planned meal to today">
                  <p className="text-slate-500 text-sm leading-relaxed">On any planned day, tap a meal and choose <span className="font-semibold text-slate-700">Log to Diary</span>. The calories and macros are added to that day's tracker instantly — no need to search again.</p>
                </StepCard>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: Recipes ─── */}
        <section className="space-y-6">
          <div>
            <SectionLabel color="bg-purple-100 text-purple-700">
              <ChefHat className="h-3.5 w-3.5" /> Recipes
            </SectionLabel>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900">AI Recipe Generator</h2>
            <p className="text-slate-500 mt-1">Available with Pro. Describe what you want to eat and get a full recipe with nutrition data in seconds.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-400" />
              <span className="font-semibold text-sm text-slate-700">How to generate a recipe</span>
            </div>
            <div className="p-5 space-y-5">
              <StepCard step={1} title="Describe what you want">
                <p className="text-slate-500 text-sm leading-relaxed mb-3">Type a description into the prompt field. You can be as specific or as vague as you like:</p>
                <div className="space-y-2">
                  {[
                    "High-protein chicken dinner under 500 calories",
                    "Breakfast with eggs and whatever is in my fridge",
                    "Vegetarian lunch with chickpeas",
                  ].map((ex, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 flex items-center gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                      "{ex}"
                    </div>
                  ))}
                </div>
              </StepCard>

              <StepCard step={2} title="Get your recipe">
                <p className="text-slate-500 text-sm leading-relaxed mb-3">Tap <span className="font-semibold text-slate-700">Generate</span>. The AI returns a recipe card showing:</p>
                {/* Mock recipe card */}
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3.5 space-y-2.5">
                  <div>
                    <p className="font-bold text-sm text-slate-800">Lemon Herb Grilled Chicken</p>
                    <p className="text-[11px] text-slate-500">2 servings · 25 min prep</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-orange-50 border border-orange-100 rounded-lg px-2.5 py-1.5 text-center">
                      <div className="text-sm font-bold text-orange-600">420</div>
                      <div className="text-[9px] text-slate-400">kcal</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5 text-center">
                      <div className="text-sm font-bold text-blue-600">48g</div>
                      <div className="text-[9px] text-slate-400">protein</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5 text-center">
                      <div className="text-sm font-bold text-emerald-600">12g</div>
                      <div className="text-[9px] text-slate-400">carbs</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 text-center">
                      <div className="text-sm font-bold text-amber-600">14g</div>
                      <div className="text-[9px] text-slate-400">fat</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <p className="font-semibold text-slate-700 text-xs">Ingredients</p>
                    <p>• 200g chicken breast, 2 tbsp olive oil, lemon juice, garlic...</p>
                  </div>
                  <div className="flex gap-2">
                    <MockButton color="bg-[#FF9800]" size="sm"><Plus className="h-3 w-3" />Log to Diary</MockButton>
                    <MockButton color="bg-purple-600" size="sm"><Sparkles className="h-3 w-3" />Save Recipe</MockButton>
                  </div>
                </div>
              </StepCard>

              <StepCard step={3} title="Log it or save it">
                <div className="space-y-2 text-sm">
                  <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <Plus className="h-4 w-4 text-[#FF9800] shrink-0 mt-0.5" />
                    <p className="text-slate-600 leading-relaxed"><span className="font-semibold text-slate-800">Log to Diary</span> — Adds the recipe's calories and macros directly to today's food log. The tracker updates immediately.</p>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <Sparkles className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                    <p className="text-slate-600 leading-relaxed"><span className="font-semibold text-slate-800">Save Recipe</span> — Stores the recipe in your Saved Recipes tab. Next time, open the saved recipe and tap Log — no need to generate it again.</p>
                  </div>
                  <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <BookOpen className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-slate-600 leading-relaxed"><span className="font-semibold text-slate-800">Add to Meal Plan</span> — Send the recipe to any day in the Meal Planner. It will appear in the grocery list when you generate one.</p>
                  </div>
                </div>
              </StepCard>
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
