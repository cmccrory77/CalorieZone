import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, ScanLine, ChefHat, CalendarDays, Sparkles, Check, Loader2 } from "lucide-react";
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

type PlanId = "monthly" | "yearly" | "lifetime";

const PRODUCT_IDS: Record<PlanId, string> = {
  monthly: "com.caloriezone.pro.monthly",
  yearly: "com.caloriezone.pro.yearly",
  lifetime: "com.caloriezone.lifetime",
};

const FALLBACK_PRICES: Record<PlanId, string> = {
  monthly: "$4.99",
  yearly: "$29.99",
  lifetime: "$49.99",
};

interface PlanDisplay {
  id: PlanId;
  productId: string;
  label: string;
  price: string;
  period: string;
  badge?: string;
  highlight?: boolean;
}

function isCapacitorNative(): boolean {
  try {
    const w = window as any;
    if (w.Capacitor?.isNativePlatform?.()) return true;
    if (window.location.protocol === "capacitor:" || window.location.protocol === "ionic:") return true;
  } catch {}
  return false;
}

function getStore(): any {
  try {
    return (window as any).CdvPurchase?.store || null;
  } catch {
    return null;
  }
}

function buildPlans(prices: Record<PlanId, string>): PlanDisplay[] {
  return [
    {
      id: "monthly",
      productId: PRODUCT_IDS.monthly,
      label: "Monthly",
      price: prices.monthly,
      period: "/month",
    },
    {
      id: "yearly",
      productId: PRODUCT_IDS.yearly,
      label: "Yearly",
      price: prices.yearly,
      period: "/year",
      badge: "Save 50%",
      highlight: true,
    },
    {
      id: "lifetime",
      productId: PRODUCT_IDS.lifetime,
      label: "Lifetime",
      price: prices.lifetime,
      period: "one-time",
      badge: "Best Value",
    },
  ];
}

function useStoreProducts() {
  const [prices, setPrices] = useState<Record<PlanId, string>>(FALLBACK_PRICES);
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!isCapacitorNative() || initialized.current) return;
    initialized.current = true;

    const store = getStore();
    if (!store) return;

    setLoading(true);

    const CdvPurchase = (window as any).CdvPurchase;
    const Platform = CdvPurchase?.Platform?.APPLE_APPSTORE;
    const ProductType = CdvPurchase?.ProductType;

    if (!Platform || !ProductType) {
      setLoading(false);
      return;
    }

    store.register([
      { id: PRODUCT_IDS.monthly, type: ProductType.PAID_SUBSCRIPTION, platform: Platform },
      { id: PRODUCT_IDS.yearly, type: ProductType.PAID_SUBSCRIPTION, platform: Platform },
      { id: PRODUCT_IDS.lifetime, type: ProductType.NON_CONSUMABLE, platform: Platform },
    ]);

    store.when()
      .productUpdated(() => {
        const updated: Record<string, string> = {};
        for (const [key, pid] of Object.entries(PRODUCT_IDS)) {
          const product = store.get(pid);
          const offer = product?.pricing;
          if (offer?.price) {
            updated[key] = offer.price;
          }
        }
        if (Object.keys(updated).length > 0) {
          setPrices((prev) => ({ ...prev, ...updated }));
        }
        setLoading(false);
      })
      .approved((transaction: any) => {
        transaction.verify();
      })
      .verified((receipt: any) => {
        receipt.finish();
      });

    store.initialize([Platform])
      .then(() => store.update())
      .catch(() => setLoading(false));
  }, []);

  return { prices, loading };
}

export default function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, attemptedFeature, setPremium } = usePremium();
  const detail = featureDetails[attemptedFeature];
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("yearly");
  const [purchasing, setPurchasing] = useState(false);
  const { prices, loading: pricesLoading } = useStoreProducts();

  const plans = buildPlans(prices);
  const selected = plans.find((p) => p.id === selectedPlan)!;

  const handlePurchase = async () => {
    const plan = plans.find((p) => p.id === selectedPlan);
    if (!plan) return;

    if (isCapacitorNative()) {
      const store = getStore();
      if (store) {
        setPurchasing(true);
        try {
          const product = store.get(plan.productId);
          const offer = product?.getOffer();
          if (offer) {
            await store.order(offer);
            setPremium(true);
            setShowUpgradeModal(false);
          } else {
            console.error("No offer found for product:", plan.productId);
          }
        } catch (err) {
          console.error("Purchase failed:", err);
        } finally {
          setPurchasing(false);
        }
      } else {
        setPremium(true);
        setShowUpgradeModal(false);
      }
    } else {
      setPremium(true);
      setShowUpgradeModal(false);
    }
  };

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
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Choose your plan</p>
            {pricesLoading ? (
              <div className="flex items-center justify-center py-6 gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                <span className="text-sm text-slate-400">Loading prices...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all text-left ${
                      selectedPlan === plan.id
                        ? "border-[#4CAF50] bg-[#4CAF50]/5"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                    }`}
                    data-testid={`plan-option-${plan.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedPlan === plan.id
                          ? "border-[#4CAF50] bg-[#4CAF50]"
                          : "border-slate-300 dark:border-slate-600"
                      }`}>
                        {selectedPlan === plan.id && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${
                            selectedPlan === plan.id ? "text-slate-800 dark:text-slate-200" : "text-slate-600 dark:text-slate-300"
                          }`}>
                            {plan.label}
                          </span>
                          {plan.badge && (
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                              plan.highlight
                                ? "bg-[#4CAF50] text-white"
                                : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                            }`}>
                              {plan.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${
                        selectedPlan === plan.id ? "text-slate-800 dark:text-slate-200" : "text-slate-600 dark:text-slate-300"
                      }`}>
                        {plan.price}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-0.5">{plan.period}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              className="w-full h-12 rounded-xl bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold text-base shadow-lg shadow-primary/20"
              onClick={handlePurchase}
              disabled={purchasing || pricesLoading}
              data-testid="button-upgrade-pro"
            >
              {purchasing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Crown className="h-4 w-4 mr-2" />
              )}
              {purchasing ? "Processing..." : `Get Pro — ${selected.price}${selected.id !== "lifetime" ? selected.period : ""}`}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground">
              {selected.id === "lifetime"
                ? "One-time purchase · Unlock all features forever"
                : selected.id === "yearly"
                  ? "Billed annually · Cancel anytime"
                  : "Billed monthly · Cancel anytime"}
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
