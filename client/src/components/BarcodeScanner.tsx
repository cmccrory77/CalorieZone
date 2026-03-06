import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScanBarcode, Camera, Plus, Loader2, AlertCircle, Hash, Search } from "lucide-react";

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

const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.ITF,
];

export default function BarcodeScanner({ onLog }: BarcodeScannerProps) {
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [looking, setLooking] = useState(false);
  const [product, setProduct] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [mode, setMode] = useState<"choose" | "camera" | "manual">("choose");
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
    setProduct(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();

      if (data.status === 1 && data.product) {
        const p = data.product;
        const nutriments = p.nutriments || {};
        const servingSize = p.serving_size || p.quantity || "1 serving";

        const caloriesPerServing = nutriments["energy-kcal_serving"]
          ?? nutriments["energy-kcal_100g"]
          ?? Math.round((nutriments["energy_serving"] ?? nutriments["energy_100g"] ?? 0) / 4.184);

        setProduct({
          name: p.product_name || p.product_name_en || "Unknown Product",
          brand: p.brands || "",
          calories: Math.round(caloriesPerServing),
          protein: Math.round(nutriments["proteins_serving"] ?? nutriments["proteins_100g"] ?? 0),
          carbs: Math.round(nutriments["carbohydrates_serving"] ?? nutriments["carbohydrates_100g"] ?? 0),
          fat: Math.round(nutriments["fat_serving"] ?? nutriments["fat_100g"] ?? 0),
          servingSize,
          imageUrl: p.image_front_small_url || p.image_url
        });
      } else {
        setError("Product not found in database. Try a different barcode or enter it manually.");
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setError("Lookup timed out. Check your internet connection and try again.");
      } else {
        setError("Could not look up product. Check your internet connection and try again.");
      }
    } finally {
      setLooking(false);
    }
  }, []);

  const startScanner = useCallback(async () => {
    setProduct(null);
    setError(null);
    setLogged(false);
    setMode("camera");
    setScanning(true);

    await new Promise(r => setTimeout(r, 300));

    const el = document.getElementById(containerRef.current);
    if (!el) {
      setError("Scanner container not ready. Please try again.");
      setScanning(false);
      return;
    }

    try {
      const scanner = new Html5Qrcode(containerRef.current, {
        formatsToSupport: BARCODE_FORMATS,
        verbose: false,
      });
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: { width: 280, height: 120 },
          aspectRatio: 1.6,
          disableFlip: false,
        },
        async (decodedText) => {
          try {
            await stopScanner();
            await lookupBarcode(decodedText);
          } catch {
            setLooking(false);
            setError("Something went wrong looking up the product. Please try again.");
          }
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
      setManualCode("");
      setMode("choose");
    }
  }, [open, stopScanner]);

  const handleManualLookup = async () => {
    const code = manualCode.trim();
    if (!code) return;
    await stopScanner();
    await lookupBarcode(code);
  };

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

  const resetToChoose = () => {
    stopScanner();
    setProduct(null);
    setError(null);
    setLogged(false);
    setManualCode("");
    setMode("choose");
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
              Scan or type a barcode to look up nutrition facts
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 pb-5 space-y-4">
            {mode === "choose" && !product && !looking && !error && (
              <div className="space-y-3">
                <button
                  onClick={startScanner}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                  data-testid="button-start-scanning"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">Scan with Camera</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Point your camera at a product barcode</p>
                  </div>
                </button>

                <button
                  onClick={() => { setMode("manual"); setError(null); setProduct(null); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                  data-testid="button-enter-barcode"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <Hash className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">Enter Barcode Number</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Type the number printed below the barcode</p>
                  </div>
                </button>
              </div>
            )}

            {mode === "manual" && !product && !looking && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enter the barcode number found below the barcode on the product packaging.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. 012345678901"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.replace(/[^0-9]/g, ""))}
                      onKeyDown={(e) => e.key === "Enter" && handleManualLookup()}
                      className="flex-1 bg-slate-50 border-slate-200 text-sm h-10 font-mono tracking-wider"
                      autoFocus
                      inputMode="numeric"
                      data-testid="input-barcode-number"
                    />
                    <Button
                      onClick={handleManualLookup}
                      disabled={!manualCode.trim()}
                      className="h-10 px-4 bg-primary hover:bg-primary/90 text-white gap-1.5"
                      data-testid="button-lookup-barcode"
                    >
                      <Search className="h-4 w-4" />
                      Look Up
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground"
                  onClick={resetToChoose}
                >
                  Back
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => { stopScanner(); setMode("manual"); }}
                    data-testid="button-switch-to-manual"
                  >
                    <Hash className="h-3.5 w-3.5 mr-1.5" />
                    Type Barcode Instead
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={resetToChoose}
                    data-testid="button-cancel-scanning"
                  >
                    Cancel
                  </Button>
                </div>
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={startScanner}
                    data-testid="button-try-again-scan"
                  >
                    <Camera className="h-3.5 w-3.5 mr-1.5" />
                    Try Camera
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setError(null); setMode("manual"); }}
                    data-testid="button-try-manual"
                  >
                    <Hash className="h-3.5 w-3.5 mr-1.5" />
                    Type Barcode
                  </Button>
                </div>
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
                        onClick={resetToChoose}
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
                        onClick={resetToChoose}
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
