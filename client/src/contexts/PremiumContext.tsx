import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface PremiumContextType {
  isPremium: boolean;
  setPremium: (value: boolean) => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (value: boolean) => void;
  attemptedFeature: string;
  requirePremium: (featureName: string) => boolean;
}

const PremiumContext = createContext<PremiumContextType | null>(null);

const STORAGE_KEY = "caloriezone-premium";
const BUILD_VERSION_KEY = "caloriezone-build-version";
const CURRENT_BUILD = "2026031502";

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(() => {
    try {
      const savedBuild = localStorage.getItem(BUILD_VERSION_KEY);
      if (savedBuild !== CURRENT_BUILD) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(BUILD_VERSION_KEY, CURRENT_BUILD);
        return false;
      }
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [attemptedFeature, setAttemptedFeature] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, isPremium ? "true" : "false");
    } catch {}
  }, [isPremium]);

  const setPremium = useCallback((value: boolean) => {
    setIsPremium(value);
  }, []);

  const requirePremium = useCallback((featureName: string): boolean => {
    if (isPremium) return true;
    setAttemptedFeature(featureName);
    setShowUpgradeModal(true);
    return false;
  }, [isPremium]);

  return (
    <PremiumContext.Provider value={{
      isPremium,
      setPremium,
      showUpgradeModal,
      setShowUpgradeModal,
      attemptedFeature,
      requirePremium,
    }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be used within PremiumProvider");
  return ctx;
}
