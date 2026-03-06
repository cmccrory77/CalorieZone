import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Camera, Sparkles, Loader2, AlertCircle, Plus, Check, ImageIcon } from "lucide-react";

interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AnalysisResult {
  items: FoodItem[];
  totalCalories: number;
  confidence: "high" | "medium" | "low";
}

interface MealScannerProps {
  onLog: (food: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void;
}

export default function MealScanner({ onLog }: MealScannerProps) {
  const [open, setOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loggedItems, setLoggedItems] = useState<Set<number>>(new Set());
  const [allLogged, setAllLogged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const reset = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
    setLoggedItems(new Set());
    setAllLogged(false);
    stopCamera();
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setResult(null);
    setCapturedImage(null);
    setLoggedItems(new Set());
    setAllLogged(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch {
      setError("Could not access camera. You can also upload a photo from your gallery.");
    }
  }, []);

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive]);

  const captureFromCamera = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
    analyzeImage(dataUrl);
  }, [stopCamera]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedImage(dataUrl);
      setError(null);
      setResult(null);
      setLoggedItems(new Set());
      setAllLogged(false);
      analyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const analyzeImage = async (imageDataUrl: string) => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Analysis failed" }));
        throw new Error(err.message || "Analysis failed");
      }
      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Could not analyze the image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLogItem = (item: FoodItem, idx: number) => {
    onLog({
      name: item.name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
    });
    setLoggedItems(prev => new Set(prev).add(idx));
  };

  const handleLogAll = () => {
    if (!result) return;
    result.items.forEach((item, idx) => {
      if (!loggedItems.has(idx)) {
        onLog({
          name: item.name,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
        });
      }
    });
    setAllLogged(true);
  };

  const confidenceColor: Record<string, string> = {
    high: "text-green-600 bg-green-50",
    medium: "text-amber-600 bg-amber-50",
    low: "text-red-500 bg-red-50",
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9 gap-1.5 text-xs border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-600"
        onClick={() => { reset(); setOpen(true); }}
        data-testid="button-meal-scanner"
      >
        <Sparkles className="h-3.5 w-3.5" />
        AI Scan
      </Button>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
        data-testid="input-meal-photo-upload"
      />

      <Dialog open={open} onOpenChange={(v) => { if (!v) { stopCamera(); } setOpen(v); }}>
        <DialogContent className="max-w-sm p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-5 pb-3">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Meal Scanner
            </DialogTitle>
            <DialogDescription className="text-sm">
              Take a photo of your meal and AI will identify each food item with calories
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 pb-5 space-y-4">
            {!capturedImage && !cameraActive && !analyzing && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <Camera className="h-10 w-10 text-purple-500" />
                </div>
                <p className="text-sm text-center text-muted-foreground max-w-[240px]">
                  Take a photo of your meal or upload one from your gallery
                </p>
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={startCamera}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white gap-2"
                    data-testid="button-start-meal-camera"
                  >
                    <Camera className="h-4 w-4" />
                    Camera
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="button-upload-meal-photo"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>
            )}

            {cameraActive && (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-white/20 rounded-xl pointer-events-none"></div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white gap-2"
                    onClick={captureFromCamera}
                    data-testid="button-capture-meal"
                  >
                    <Camera className="h-4 w-4" />
                    Capture
                  </Button>
                  <Button
                    variant="outline"
                    className="shrink-0"
                    onClick={() => { stopCamera(); }}
                    data-testid="button-cancel-meal-camera"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center gap-3 py-8">
                {capturedImage && (
                  <div className="w-full rounded-xl overflow-hidden mb-2">
                    <img src={capturedImage} alt="Meal" className="w-full h-40 object-cover" />
                  </div>
                )}
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                <p className="text-sm text-muted-foreground">Analyzing your meal...</p>
              </div>
            )}

            {error && (
              <div className="space-y-3">
                {capturedImage && (
                  <div className="w-full rounded-xl overflow-hidden">
                    <img src={capturedImage} alt="Meal" className="w-full h-40 object-cover" />
                  </div>
                )}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { reset(); startCamera(); }}
                    data-testid="button-retry-meal-camera"
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setError(null); setCapturedImage(null); fileInputRef.current?.click(); }}
                    data-testid="button-retry-meal-upload"
                  >
                    Upload Instead
                  </Button>
                </div>
              </div>
            )}

            {result && !analyzing && (
              <div className="space-y-4">
                {capturedImage && (
                  <div className="w-full rounded-xl overflow-hidden">
                    <img src={capturedImage} alt="Meal" className="w-full h-36 object-cover" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">Detected Items</span>
                    <span className="text-xs text-muted-foreground ml-2">({result.items.length})</span>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${confidenceColor[result.confidence] || confidenceColor.medium}`}>
                    {result.confidence} confidence
                  </span>
                </div>

                <div className="space-y-2">
                  {result.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                      data-testid={`card-meal-item-${idx}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-800 truncate">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.portion}</div>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs font-semibold text-secondary">{item.calories} kcal</span>
                          <span className="text-xs text-blue-500">P: {item.protein}g</span>
                          <span className="text-xs text-emerald-500">C: {item.carbs}g</span>
                          <span className="text-xs text-amber-500">F: {item.fat}g</span>
                        </div>
                      </div>
                      {loggedItems.has(idx) || allLogged ? (
                        <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <Button
                          size="icon"
                          variant="outline"
                          className="shrink-0 h-8 w-8 rounded-full border-secondary/30 hover:bg-secondary/10"
                          onClick={() => handleLogItem(item, idx)}
                          data-testid={`button-log-meal-item-${idx}`}
                        >
                          <Plus className="h-3.5 w-3.5 text-secondary" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/10 border border-secondary/20">
                  <div>
                    <span className="text-sm font-bold text-secondary">{result.totalCalories}</span>
                    <span className="text-xs text-secondary/80 ml-1">total kcal</span>
                  </div>
                  {!allLogged && loggedItems.size < result.items.length ? (
                    <Button
                      size="sm"
                      className="bg-secondary hover:bg-secondary/90 text-white gap-1.5 h-8"
                      onClick={handleLogAll}
                      data-testid="button-log-all-meal-items"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Log All
                    </Button>
                  ) : (
                    <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> All logged
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { reset(); }}
                  data-testid="button-scan-another-meal"
                >
                  Scan Another Meal
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
