import { useState, useRef, useCallback, useEffect } from "react";
import { resolveApiUrl } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScanBarcode, Camera, Plus, Loader2, AlertCircle, Minus, Search, ImageIcon, Lock } from "lucide-react";

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
  onBeforeOpen?: () => boolean;
  locked?: boolean;
}

function resizeImageToBlob(source: HTMLVideoElement | HTMLImageElement | File): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const maxDim = 1280;

    const draw = (img: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, w: number, h: number) => {
      const scale = Math.min(maxDim / w, maxDim / h, 1);
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      ctx.drawImage(img as any, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) resolve(new File([blob], "scan.jpg", { type: "image/jpeg" }));
        else reject(new Error("Failed to create blob"));
      }, "image/jpeg", 0.9);
    };

    if (source instanceof HTMLVideoElement) {
      draw(source, source.videoWidth, source.videoHeight);
    } else if (source instanceof File) {
      const img = new Image();
      img.onload = () => { draw(img, img.naturalWidth, img.naturalHeight); URL.revokeObjectURL(img.src); };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(source);
    } else {
      draw(source, source.naturalWidth, source.naturalHeight);
    }
  });
}

async function tryDecode(file: File): Promise<string | null> {
  const { Html5Qrcode } = await import("html5-qrcode");
  const tempId = "bcd-" + Math.random().toString(36).slice(2);
  const div = document.createElement("div");
  div.id = tempId;
  div.style.cssText = "position:fixed;left:-9999px;top:0;width:300px;height:300px;overflow:hidden;";
  document.body.appendChild(div);
  try {
    const scanner = new Html5Qrcode(tempId);
    const result = await scanner.scanFile(file, false);
    try { scanner.clear(); } catch {}
    return result;
  } catch {
    return null;
  } finally {
    try { document.body.removeChild(div); } catch {}
  }
}

export default function BarcodeScanner({ onLog, onBeforeOpen, locked }: BarcodeScannerProps) {
  const [open, setOpen] = useState(false);
  const [looking, setLooking] = useState(false);
  const [product, setProduct] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);
  const [servings, setServings] = useState(1);
  const [manualCode, setManualCode] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanStatus, setScanStatus] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const foundRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setScanStatus("");
  }, []);

  const lookupBarcode = useCallback(async (code: string) => {
    setLooking(true);
    setError(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
      const data = await res.json();

      if (data.status === 1 && data.product) {
        const p = data.product;
        const n = p.nutriments || {};
        const servingSize = p.serving_size || p.quantity || "1 serving";

        const cal = n["energy-kcal_serving"]
          ?? n["energy-kcal_100g"]
          ?? Math.round((n["energy_serving"] ?? n["energy_100g"] ?? 0) / 4.184);

        setProduct({
          name: p.product_name || p.product_name_en || "Unknown Product",
          brand: p.brands || "",
          calories: Math.round(cal),
          protein: Math.round(n["proteins_serving"] ?? n["proteins_100g"] ?? 0),
          carbs: Math.round(n["carbohydrates_serving"] ?? n["carbohydrates_100g"] ?? 0),
          fat: Math.round(n["fat_serving"] ?? n["fat_100g"] ?? 0),
          servingSize,
          imageUrl: p.image_front_small_url || p.image_url
        });
        setServings(1);
      } else {
        setError("Product not found in database. Try a different product or enter the barcode manually.");
      }
    } catch {
      setError("Could not look up product. Check your internet connection and try again.");
    } finally {
      setLooking(false);
    }
  }, []);

  const startCamera = useCallback(async () => {
    setProduct(null);
    setError(null);
    setLogged(false);
    setShowManual(false);
    foundRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setCameraActive(true);
      setScanStatus("Point camera at barcode, then tap Capture");
    } catch {
      setError("Camera access was denied. Please allow camera permissions or enter the barcode manually.");
    }
  }, []);

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive]);

  const readBarcodeWithAI = useCallback(async (file: File): Promise<string | null> => {
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const res = await fetch(resolveApiUrl("/api/read-barcode"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.code || null;
    } catch {
      return null;
    }
  }, []);

  const captureAndDecode = useCallback(async () => {
    if (!videoRef.current || foundRef.current) return;
    setScanStatus("Reading barcode...");

    try {
      const file = await resizeImageToBlob(videoRef.current);
      let code = await tryDecode(file);

      if (!code) {
        setScanStatus("Using AI to read barcode...");
        code = await readBarcodeWithAI(file);
      }

      if (code) {
        foundRef.current = true;
        stopCamera();
        await lookupBarcode(code);
      } else {
        setScanStatus("No barcode found — move closer and try again");
        setTimeout(() => setScanStatus("Point camera at barcode, then tap Capture"), 3000);
      }
    } catch {
      setScanStatus("Point camera at barcode, then tap Capture");
    }
  }, [stopCamera, lookupBarcode, readBarcodeWithAI]);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = "";

    stopCamera();
    setError(null);
    setProduct(null);
    setLooking(true);
    setScanStatus("Reading barcode from photo...");

    try {
      const resized = await resizeImageToBlob(file);
      let code = await tryDecode(resized);

      if (!code) {
        setScanStatus("Using AI to read barcode...");
        code = await readBarcodeWithAI(resized);
      }

      setScanStatus("");
      if (code) {
        await lookupBarcode(code);
      } else {
        setLooking(false);
        setError("No barcode found in the photo. Make sure the barcode is clearly visible, well-lit, and in focus. You can also type the number manually.");
      }
    } catch {
      setScanStatus("");
      setLooking(false);
      setError("Could not process the photo. Please try again.");
    }
  }, [stopCamera, lookupBarcode, readBarcodeWithAI]);

  useEffect(() => {
    if (!open) {
      stopCamera();
      foundRef.current = false;
      setProduct(null);
      setError(null);
      setLogged(false);
      setServings(1);
      setManualCode("");
      setShowManual(false);
      setScanStatus("");
    }
  }, [open, stopCamera]);

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  const handleManualLookup = async () => {
    const code = manualCode.trim();
    if (!code) return;
    stopCamera();
    setShowManual(false);
    await lookupBarcode(code);
  };

  const displayCalories = product ? Math.round(product.calories * servings) : 0;
  const displayProtein = product ? Math.round(product.protein * servings) : 0;
  const displayCarbs = product ? Math.round(product.carbs * servings) : 0;
  const displayFat = product ? Math.round(product.fat * servings) : 0;

  const handleLog = () => {
    if (product) {
      const suffix = servings !== 1 ? ` x${servings}` : "";
      onLog({
        name: (product.brand ? `${product.name} (${product.brand})` : product.name) + suffix,
        calories: displayCalories,
        protein: displayProtein,
        carbs: displayCarbs,
        fat: displayFat
      });
      setLogged(true);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1.5 text-xs border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
        onClick={() => { if (onBeforeOpen && !onBeforeOpen()) return; setOpen(true); }}
        data-testid="button-barcode-scanner"
      >
        <ScanBarcode className="h-3.5 w-3.5" />
        Scan
        {locked && <Lock className="h-2.5 w-2.5 text-amber-500" />}
      </Button>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        data-testid="input-barcode-photo"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
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
            {!cameraActive && !product && !looking && !showManual && !error && !scanStatus && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Camera className="h-10 w-10 text-primary" />
                </div>
                <p className="text-sm text-center text-muted-foreground max-w-[240px]">
                  Point your camera at a barcode to scan it
                </p>
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={startCamera}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
                    data-testid="button-start-scanning"
                  >
                    <Camera className="h-4 w-4" />
                    Open Camera
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="button-upload-barcode"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
                <button
                  onClick={() => setShowManual(true)}
                  className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors"
                  data-testid="button-enter-barcode"
                >
                  Or enter barcode number manually
                </button>
              </div>
            )}

            {showManual && !product && !looking && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Type the number printed below the barcode on the packaging.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. 012345678901"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.replace(/[^0-9]/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && handleManualLookup()}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm h-10 font-mono tracking-wider"
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
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground"
                  onClick={() => setShowManual(false)}
                >
                  Back
                </Button>
              </div>
            )}

            {cameraActive && (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "3/4" }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[85%] h-[35%] border-2 border-white/70 rounded-lg shadow-lg">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap">
                        Align barcode inside this area
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  {scanStatus.includes("Reading") || scanStatus.includes("Using AI") ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  {scanStatus || "Point camera at barcode, then tap Capture"}
                </div>
                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white gap-2 text-base font-semibold rounded-xl shadow-lg"
                  onClick={captureAndDecode}
                  data-testid="button-capture-barcode"
                >
                  <Camera className="h-5 w-5" />
                  Capture
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => { stopCamera(); fileInputRef.current?.click(); }}
                    data-testid="button-take-photo"
                  >
                    <ImageIcon className="h-4 w-4 mr-1.5" />
                    Photo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => { stopCamera(); setShowManual(true); }}
                    data-testid="button-switch-to-manual"
                  >
                    <Search className="h-4 w-4 mr-1.5" />
                    Type
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={stopCamera}
                    data-testid="button-cancel-scanning"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {scanStatus && !cameraActive && !product && !error && (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{scanStatus}</p>
              </div>
            )}

            {looking && (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{scanStatus || "Looking up product..."}</p>
              </div>
            )}

            {error && (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-1.5"
                    onClick={() => { setError(null); startCamera(); }}
                    data-testid="button-try-again-scan"
                  >
                    <Camera className="h-4 w-4" />
                    Camera
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-1.5"
                    onClick={() => { setError(null); fileInputRef.current?.click(); }}
                    data-testid="button-try-photo"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Photo
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-1.5"
                    onClick={() => { setError(null); setShowManual(true); }}
                    data-testid="button-try-manual"
                  >
                    <Search className="h-4 w-4" />
                    Type
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
                      className="w-16 h-16 rounded-lg object-cover border border-slate-100 dark:border-slate-700 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-tight" data-testid="text-scanned-product-name">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <p className="text-xs text-muted-foreground mt-0.5">{product.brand}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Per serving: {product.servingSize}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    How many servings did you have?
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                      disabled={servings <= 0.5}
                      data-testid="button-decrease-servings"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200 min-w-[2rem] text-center" data-testid="text-servings-count">
                      {servings}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setServings(servings + 0.5)}
                      data-testid="button-increase-servings"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-xs text-muted-foreground ml-1">
                      {servings === 1 ? "serving" : "servings"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-3 rounded-xl bg-secondary/10">
                    <div className="text-lg font-bold text-secondary" data-testid="text-scanned-calories">{displayCalories}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">kcal</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                    <div className="text-lg font-bold text-blue-600">{displayProtein}g</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Protein</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
                    <div className="text-lg font-bold text-amber-600">{displayCarbs}g</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Carbs</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
                    <div className="text-lg font-bold text-red-500">{displayFat}g</div>
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
                        onClick={startCamera}
                        data-testid="button-scan-another"
                      >
                        Scan Another
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium" data-testid="text-logged-confirmation">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Logged!
                      </div>
                      <Button
                        variant="outline"
                        className="shrink-0"
                        onClick={startCamera}
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
