import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScanBarcode, Camera, X, Plus, Loader2, AlertCircle } from "lucide-react";

interface NutritionInfo {
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  imageUrl?: string;
}

interface BarcodeScannerProps {
  onLog: (food: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void;
}

export default function BarcodeScanner({ onLog }: BarcodeScannerProps) {
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [looking, setLooking] = useState(false);
  const [product, setProduct] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<string>("barcode-reader-" + Math.random().toString(36).slice(2));

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  const lookupBarcode = useCallback(async (code: string) => {
    setLooking(true);
    setError(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
      const data = await res.json();

      if (data.status === 1 && data.product) {
        const p = data.product;
        const nutriments = p.nutriments || {};

        const servingSizeRaw = p.serving_size || "";
        const servingQuantity = p.serving_quantity;
        const numServings = p.product_quantity && servingQuantity
          ? parseFloat(p.product_quantity) / servingQuantity
          : null;

        const getNutrient = (key: string): number => {
          const perServing = nutriments[`${key}_serving`];
          const per100g = nutriments[`${key}_100g`];

          if (perServing != null && servingQuantity && numServings && numServings > 1.5) {
            return per100g != null && servingQuantity
              ? (per100g * servingQuantity) / 100
              : perServing / numServings;
          }

          if (perServing != null && servingQuantity) {
            if (per100g != null) {
              const calcFromWeight = (per100g * servingQuantity) / 100;
              if (Math.abs(perServing - calcFromWeight) < calcFromWeight * 0.3) {
                return calcFromWeight;
              }
              return calcFromWeight;
            }
            return perServing;
          }

          if (per100g != null && servingQuantity) {
            return (per100g * servingQuantity) / 100;
          }

          if (perServing != null) return perServing;
          if (per100g != null) return per100g;
          return 0;
        };

        let calories = getNutrient("energy-kcal");
        if (calories === 0) {
          const energyKj = getNutrient("energy");
          if (energyKj > 0) calories = energyKj / 4.184;
        }

        const servingDisplay = servingSizeRaw || (servingQuantity ? `${servingQuantity}g` : "1 serving");

        setProduct({
          name: p.product_name || p.product_name_en || "Unknown Product",
          brand: p.brands || "",
          calories: Math.round(calories),
          protein: Math.round(getNutrient("proteins")),
          carbs: Math.round(getNutrient("carbohydrates")),
          fat: Math.round(getNutrient("fat")),
          servingSize: servingDisplay,
          imageUrl: p.image_front_small_url || p.image_url
        });
      } else {
        setError("Product not found in database. Try a different product or enter calories manually.");
      }
    } catch {
      setError("Could not look up product. Check your internet connection and try again.");
    } finally {
      setLooking(false);
    }
  }, []);

  const startScanner = useCallback(async () => {
    setProduct(null);
    setError(null);
    setLogged(false);
    setScanning(true);

    await new Promise(r => setTimeout(r, 300));

    const el = document.getElementById(containerRef.current);
    if (!el) {
      setError("Scanner container not ready. Please try again.");
      setScanning(false);
      return;
    }

    try {
      const scanner = new Html5Qrcode(containerRef.current);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 280, height: 160 },
          aspectRatio: 1.6,
        },
        async (decodedText) => {
          await stopScanner();
          lookupBarcode(decodedText);
        },
        () => {}
      );
    } catch (err: any) {
      setScanning(false);
      if (err?.toString?.().includes("NotAllowedError") || err?.toString?.().includes("Permission")) {
        setError("Camera access was denied. Please allow camera permissions in your browser settings and try again.");
      } else {
        setError("Could not start camera. Make sure your device has a camera and no other app is using it.");
      }
    }
  }, [stopScanner, lookupBarcode]);

  useEffect(() => {
    if (!open) {
      stopScanner();
      setProduct(null);
      setError(null);
      setLogged(false);
    }
  }, [open, stopScanner]);

  const handleLog = () => {
    if (product) {
      onLog({
        name: product.brand ? `${product.name} (${product.brand})` : product.name,
        calories: product.calories,
        protein: product.protein,
        carbs: product.carbs,
        fat: product.fat
      });
      setLogged(true);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1.5 text-xs border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
        onClick={() => setOpen(true)}
        data-testid="button-barcode-scanner"
      >
        <ScanBarcode className="h-3.5 w-3.5" />
        Scan
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <DialogHeader className="p-5 pb-3">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <ScanBarcode className="h-5 w-5 text-primary" />
              Barcode Scanner
            </DialogTitle>
            <DialogDescription className="text-sm">
              Scan a product barcode to look up nutrition facts
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 pb-5 space-y-4">
            {!scanning && !product && !looking && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Camera className="h-10 w-10 text-primary" />
                </div>
                <p className="text-sm text-center text-muted-foreground max-w-[240px]">
                  Position the barcode in front of your camera to scan it automatically
                </p>
                <Button
                  onClick={startScanner}
                  className="bg-primary hover:bg-primary/90 text-white gap-2"
                  data-testid="button-start-scanning"
                >
                  <Camera className="h-4 w-4" />
                  Open Camera
                </Button>
              </div>
            )}

            {scanning && (
              <div className="space-y-3">
                <div
                  id={containerRef.current}
                  className="rounded-xl overflow-hidden bg-black aspect-[16/10]"
                ></div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Point camera at a barcode...
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={stopScanner}
                  data-testid="button-cancel-scanning"
                >
                  Cancel
                </Button>
              </div>
            )}

            {looking && (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Looking up product...</p>
              </div>
            )}

            {error && (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={startScanner}
                  data-testid="button-try-again-scan"
                >
                  Try Again
                </Button>
              </div>
            )}

            {product && (
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-100 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-slate-800 leading-tight" data-testid="text-scanned-product-name">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <p className="text-xs text-muted-foreground mt-0.5">{product.brand}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Per serving ({product.servingSize})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-3 rounded-xl bg-secondary/10">
                    <div className="text-lg font-bold text-secondary" data-testid="text-scanned-calories">{product.calories}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">kcal</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-blue-50">
                    <div className="text-lg font-bold text-blue-600">{product.protein}g</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Protein</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-emerald-50">
                    <div className="text-lg font-bold text-emerald-600">{product.carbs}g</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Carbs</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-amber-50">
                    <div className="text-lg font-bold text-amber-600">{product.fat}g</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Fat</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!logged ? (
                    <>
                      <Button
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-white gap-1.5"
                        onClick={handleLog}
                        data-testid="button-log-scanned-food"
                      >
                        <Plus className="h-4 w-4" />
                        Log to Diary
                      </Button>
                      <Button
                        variant="outline"
                        className="shrink-0"
                        onClick={startScanner}
                        data-testid="button-scan-another"
                      >
                        Scan Another
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm font-medium" data-testid="text-logged-confirmation">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Logged!
                      </div>
                      <Button
                        variant="outline"
                        className="shrink-0"
                        onClick={startScanner}
                        data-testid="button-scan-another-after-log"
                      >
                        Scan Another
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
