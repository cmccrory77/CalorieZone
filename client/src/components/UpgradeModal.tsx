import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, ScanLine, ChefHat, CalendarDays, Sparkles, X } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

const featureDetails: Record<string, { icon: typeof Crown; description: string }> = {
  "Meal Planner": {
    icon: CalendarDays,
    description: "Generate personalized weekly meal plans tailored to your calorie goals.",
  },
  "Recipes": {
    icon: ChefHat,
    description: "Access AI-generated recipes, save your favorites, and get grocery lists.",
  },
  "Barcode Scanner": {
    icon: ScanLine,
    description: "Instantly scan food barcodes to log nutrition info with zero effort.",
  },
  "AI Meal Scanner": {
    icon: Sparkles,
    description: "Take a photo of any meal and let AI identify foods and estimate calories.",
  },
};

const premiumFeatures = [
  { icon: CalendarDays, label: "Meal Planner" },
  { icon: ChefHat, label: "AI Recipes" },
  { icon: ScanLine, label: "Barcode Scanner" },
  { icon: Sparkles, label: "AI Meal Scanner" },
];

export default function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, attemptedFeature, setPremium } = usePremium();
  const detail = featureDetails[attemptedFeature];

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-0">
        <div className="bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown className="h-8 w-8" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-['Poppins',sans-serif] font-bold text-white">
              Unlock CalorieZone Pro
            </DialogTitle>
            <DialogDescription className="text-white/80 mt-2">
              {detail
                ? detail.description
                : "Get access to all premium features and supercharge your health journey."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Everything in Pro</p>
            <div className="grid grid-cols-2 gap-2">
              {premiumFeatures.map((f) => (
                <div
                  key={f.label}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                    f.label === attemptedFeature
                      ? "border-primary bg-primary/5"
                      : "border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <f.icon className={`h-4 w-4 ${f.label === attemptedFeature ? "text-primary" : "text-slate-400"}`} />
                  <span className={`text-xs font-medium ${f.label === attemptedFeature ? "text-primary" : "text-slate-600 dark:text-slate-300"}`}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full h-12 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold text-base shadow-lg shadow-primary/20"
              onClick={() => {
                setPremium(true);
                setShowUpgradeModal(false);
              }}
              data-testid="button-upgrade-pro"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
            <p className="text-[10px] text-center text-muted-foreground">
              One-time purchase · Unlock all features forever
            </p>
          </div>

          <button
            onClick={() => setShowUpgradeModal(false)}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors py-1"
            data-testid="button-dismiss-upgrade"
          >
            Maybe Later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
