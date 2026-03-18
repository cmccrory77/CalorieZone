import { useState, useEffect } from "react";
import { Apple, Activity, ChefHat, CalendarDays, Zap, Shield, BarChart3, ScanLine, ArrowRight, Star, CheckCircle2 } from "lucide-react";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-slate-900 overflow-x-hidden">

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-sm" : "bg-transparent"}`} data-testid="landing-nav">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-[#4CAF50]" />
            <span className="font-['Poppins',sans-serif] font-bold text-xl tracking-tight">CalorieZone</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/tutorial"
              className="text-sm font-medium text-slate-600 hover:text-[#4CAF50] transition-colors"
              data-testid="link-how-it-works-nav"
            >
              How it works
            </a>
            <a
              href="#download"
              className="bg-[#4CAF50] hover:bg-[#43A047] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              data-testid="link-download-nav"
            >
              Download
            </a>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-white to-white" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#4CAF50]/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered Nutrition Tracking
          </div>
          <h1 className="font-['Poppins',sans-serif] text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6" data-testid="text-hero-title">
            Your Weight Goals,{" "}
            <span className="text-[#4CAF50]">Simplified.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl mx-auto mb-10" data-testid="text-hero-subtitle">
            Track calories, plan meals, and discover recipes — all personalized to your body and your goals.
          </p>
          <a
            href="https://apps.apple.com"
            className="inline-flex items-center gap-2.5 bg-black hover:bg-slate-800 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-base"
            data-testid="link-download-hero"
          >
            <Apple className="h-5 w-5" />
            Download on the App Store
          </a>
        </div>
      </section>

      <section className="py-20 px-6" data-testid="section-features-visual">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Poppins',sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="text-features-title">
              Everything you need to reach your target
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              Three powerful tools, one simple app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {[
              {
                img: "/promo-1-tracker.png",
                title: "Track Calories & Macros Easily",
                desc: "Log meals in seconds with barcode scanning, AI recognition, or quick search. See your daily progress at a glance."
              },
              {
                img: "/promo-2-planner.png",
                title: "Meal Plans Tailored to Your Calorie Target",
                desc: "Get a full week of meals built around your goals — balanced, high-protein, keto, or vegetarian."
              },
              {
                img: "/promo-3-recipes.png",
                title: "Smart Recipes & Grocery Lists in Seconds",
                desc: "AI-curated recipes matched to your calorie target with exact macro breakdowns and step-by-step instructions."
              }
            ].map((item, i) => (
              <div key={i} className="group" data-testid={`feature-card-${i}`}>
                <div className="rounded-3xl overflow-hidden shadow-lg shadow-slate-200/60 border border-slate-100 mb-6 transition-transform duration-300 group-hover:-translate-y-1">
                  <img src={item.img} alt={item.title} className="w-full" loading="lazy" />
                </div>
                <h3 className="font-['Poppins',sans-serif] text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50" data-testid="section-how-it-works">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Poppins',sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-slate-500 text-lg">Get started in under 2 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Set your goal",
                desc: "Enter your weight, target, and activity level. We calculate your perfect daily calorie budget."
              },
              {
                step: "2",
                icon: <ScanLine className="h-6 w-6" />,
                title: "Track your meals",
                desc: "Scan barcodes, use AI to snap a photo, or search from thousands of foods. Logging takes seconds."
              },
              {
                step: "3",
                icon: <CalendarDays className="h-6 w-6" />,
                title: "Follow your plan",
                desc: "Get weekly meal plans and recipes perfectly portioned for your calorie target. Stay on track effortlessly."
              }
            ].map((item, i) => (
              <div key={i} className="text-center" data-testid={`step-${i}`}>
                <div className="w-14 h-14 rounded-2xl bg-[#4CAF50]/10 text-[#4CAF50] flex items-center justify-center mx-auto mb-5">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-[#4CAF50] uppercase tracking-widest mb-2">Step {item.step}</div>
                <h3 className="font-['Poppins',sans-serif] text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6" data-testid="section-highlights">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-['Poppins',sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Built for real results
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: <ScanLine className="h-5 w-5" />, title: "AI Meal Scanner", desc: "Snap a photo of any meal and instantly get calorie and macro estimates." },
              { icon: <Activity className="h-5 w-5" />, title: "Daily Macro Tracking", desc: "See protein, carbs, and fat broken down in real time as you log." },
              { icon: <ChefHat className="h-5 w-5" />, title: "Recipe Generator", desc: "Create recipes on the fly based on your preferences and dietary needs." },
              { icon: <CalendarDays className="h-5 w-5" />, title: "Weekly Meal Plans", desc: "Auto-generated 7-day plans with breakfast, lunch, dinner, and snacks." },
              { icon: <Shield className="h-5 w-5" />, title: "Exercise Tracking", desc: "Log workouts to earn extra calories and keep your deficit on target." },
              { icon: <BarChart3 className="h-5 w-5" />, title: "Progress Dashboard", desc: "Track weight trends, streaks, and nutritional balance over time." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-white hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors" data-testid={`highlight-${i}`}>
                <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/10 text-[#4CAF50] flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50" data-testid="section-testimonials">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-['Poppins',sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-4">
              What users are saying
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah M.", text: "Lost 12 lbs in 2 months. The meal plans make it so easy to stay on track without thinking about it.", stars: 5 },
              { name: "James T.", text: "The AI scanner is a game changer. I just take a photo of my lunch and it logs everything for me.", stars: 5 },
              { name: "Priya K.", text: "I love the recipe generator. I set it to high-protein and it gives me new ideas every week.", stars: 5 },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm" data-testid={`testimonial-${i}`}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: item.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">"{item.text}"</p>
                <p className="font-semibold text-sm">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="download" className="py-24 px-6" data-testid="section-cta">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-200">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <h2 className="font-['Poppins',sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="text-cta-title">
            Start your journey today
          </h2>
          <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
            Join thousands reaching their weight goals with personalized plans and smart tracking.
          </p>
          <a
            href="https://apps.apple.com"
            className="inline-flex items-center gap-2.5 bg-black hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base"
            data-testid="link-download-cta"
          >
            <Apple className="h-5 w-5" />
            Download on the App Store
          </a>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#4CAF50]" /> Free to use</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#4CAF50]" /> No ads</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#4CAF50]" /> Private & secure</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-10 px-6" data-testid="landing-footer">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#4CAF50]" />
            <span className="font-['Poppins',sans-serif] font-bold">CalorieZone</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-sm text-slate-400 hover:text-slate-600 transition-colors" data-testid="link-privacy-footer">Privacy Policy</a>
            <a href="/terms" className="text-sm text-slate-400 hover:text-slate-600 transition-colors" data-testid="link-terms-footer">Terms of Use</a>
            <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} CalorieZone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
