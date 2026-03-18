import { useState, useEffect, useRef } from "react";
import { Keyboard } from "@capacitor/keyboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Activity, ChevronRight, ChevronLeft, CalendarDays, Moon, Sun, Armchair, Footprints, Bike, Flame, HelpCircle, User, Ruler, Scale } from "lucide-react";
import { addWeeks, addMonths, subMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, startOfDay } from "date-fns";
import { feetInchesToCm, cmToFeetInches } from "@/lib/calories";

type WizardStep = "name" | "about" | "height" | "weight" | "activity" | "timeline" | "avatar";
type EditStep = "profile" | "avatar";

interface OnboardingDialogProps {
  open: boolean;
  onComplete: (data: {
    name: string;
    avatarSeed: string;
    startingWeight: number;
    currentWeight: number;
    targetWeight: number;
    timeframe: number;
    activityLevel: string;
    targetDate: string;
    age: number | null;
    heightCm: number | null;
    sex: string | null;
  }) => void;
  onClose?: () => void;
  initialName?: string;
  initialAvatar?: string;
  initialStartingWeight?: number;
  initialCurrentWeight?: number;
  initialTargetWeight?: number;
  initialTimeframe?: number;
  initialTargetDate?: string;
  initialActivityLevel?: string;
  initialAge?: number | null;
  initialHeightCm?: number | null;
  initialSex?: string | null;
  editMode?: boolean;
}

const avatarOptions = [
  { seed: "Felix" }, { seed: "Aneka" }, { seed: "Mia" }, { seed: "Leo" },
  { seed: "Jade" }, { seed: "Riley" }, { seed: "Kai" }, { seed: "Zara" },
  { seed: "Niko" }, { seed: "Luna" }, { seed: "Avery" }, { seed: "Sam" },
  { seed: "Marcus" }, { seed: "Priya" }, { seed: "Hiro" }, { seed: "Amara" },
  { seed: "Devon" }, { seed: "Rosa" }, { seed: "Jamal" }, { seed: "Suki" },
  { seed: "Omar" }, { seed: "Ling" }, { seed: "Carlos" }, { seed: "Fatima" },
  { seed: "Henrik" }, { seed: "Yuki" }, { seed: "Dante" }, { seed: "Nadia" },
  { seed: "Ravi" }, { seed: "Elena" }, { seed: "Kwame" }, { seed: "Sophie" },
  { seed: "Jin" }, { seed: "Anika" }, { seed: "Mateo" }, { seed: "Ingrid" },
];

const activityLevels = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise, desk job", icon: Armchair, color: "text-slate-500" },
  { value: "moderate", label: "Moderate", description: "Light exercise 1–3 days/week", icon: Footprints, color: "text-blue-500" },
  { value: "active", label: "Active", description: "Exercise 3–5 days/week", icon: Bike, color: "text-green-500" },
  { value: "very_active", label: "Very Active", description: "Hard exercise 6–7 days/week", icon: Flame, color: "text-orange-500" },
];

const sexOptions = [
  { value: "man", label: "Man" },
  { value: "woman", label: "Woman" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const WIZARD_STEPS: WizardStep[] = ["name", "about", "height", "weight", "activity", "timeline", "avatar"];

export default function OnboardingDialog({
  open,
  onComplete,
  onClose,
  initialName,
  initialAvatar,
  initialStartingWeight,
  initialCurrentWeight,
  initialTargetWeight,
  initialTimeframe,
  initialTargetDate,
  initialActivityLevel,
  initialAge,
  initialHeightCm,
  initialSex,
  editMode,
}: OnboardingDialogProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    let showListener: any;
    let hideListener: any;
    (async () => {
      try {
        showListener = await Keyboard.addListener("keyboardWillShow", (info) => {
          setKeyboardHeight(info.keyboardHeight);
        });
        hideListener = await Keyboard.addListener("keyboardWillHide", () => {
          setKeyboardHeight(0);
        });
      } catch {
        const vv = window.visualViewport;
        if (vv) {
          const update = () => setKeyboardHeight(Math.max(0, window.innerHeight - vv.height));
          vv.addEventListener("resize", update);
          vv.addEventListener("scroll", update);
          return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
        }
      }
    })();
    return () => {
      showListener?.remove();
      hideListener?.remove();
    };
  }, []);

  const [name, setName] = useState(initialName || "");
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar || "Felix");
  const [startingWeight, setStartingWeight] = useState<number | null>(initialStartingWeight ?? null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(initialCurrentWeight ?? null);
  const [targetWeight, setTargetWeight] = useState<number | null>(initialTargetWeight ?? null);
  const [timeframe, setTimeframe] = useState(initialTimeframe || 12);
  const [activityLevel, setActivityLevel] = useState(initialActivityLevel || "moderate");
  const [targetDate, setTargetDate] = useState<Date>(
    initialTargetDate ? new Date(initialTargetDate + "T00:00:00") : addWeeks(new Date(), initialTimeframe || 12)
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    initialTargetDate ? new Date(initialTargetDate + "T00:00:00") : addWeeks(new Date(), initialTimeframe || 12)
  );
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  const [age, setAge] = useState<number | null>(initialAge ?? null);
  const [sex, setSex] = useState<string | null>(initialSex ?? null);
  const [heightUnit, setHeightUnit] = useState<"cm" | "imperial">("imperial");
  const [heightCmInput, setHeightCmInput] = useState<number | null>(null);
  const [heightFt, setHeightFt] = useState<number | null>(null);
  const [heightIn, setHeightIn] = useState<number | null>(null);

  const [wizardStep, setWizardStep] = useState<WizardStep>("name");
  const [editStep, setEditStep] = useState<EditStep>("profile");

  useEffect(() => {
    if (open) {
      setName(initialName || "");
      setSelectedAvatar(initialAvatar || "Felix");
      setStartingWeight(initialStartingWeight ?? null);
      setCurrentWeight(initialCurrentWeight ?? null);
      setTargetWeight(initialTargetWeight ?? null);
      setTimeframe(initialTimeframe || 12);
      setActivityLevel(initialActivityLevel || "moderate");
      setAge(initialAge ?? null);
      setSex(initialSex ?? null);
      const initDate = initialTargetDate ? new Date(initialTargetDate + "T00:00:00") : addWeeks(new Date(), initialTimeframe || 12);
      setTargetDate(initDate);
      setCalendarMonth(initDate);
      setCalendarOpen(false);
      setWizardStep("name");
      setEditStep("profile");

      if (initialHeightCm) {
        setHeightCmInput(Math.round(initialHeightCm));
        const { ft, inches } = cmToFeetInches(initialHeightCm);
        setHeightFt(ft);
        setHeightIn(inches);
      } else {
        setHeightCmInput(null);
        setHeightFt(null);
        setHeightIn(null);
      }
    }
  }, [open, initialName, initialAvatar, initialStartingWeight, initialCurrentWeight, initialTargetWeight, initialTimeframe, initialTargetDate, initialActivityLevel, initialAge, initialHeightCm, initialSex]);

  const getHeightCm = (): number | null => {
    if (heightUnit === "cm") return heightCmInput;
    if (heightFt !== null && heightIn !== null) return feetInchesToCm(heightFt, heightIn);
    if (heightFt !== null) return feetInchesToCm(heightFt, 0);
    return null;
  };

  const handleTimeframeSlider = (weeks: number) => {
    setTimeframe(weeks);
    const newDate = addWeeks(new Date(), weeks);
    setTargetDate(newDate);
    setCalendarMonth(newDate);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setTargetDate(date);
      const diffMs = date.getTime() - new Date().getTime();
      const diffWeeks = Math.max(1, Math.min(52, Math.round(diffMs / (1000 * 60 * 60 * 24 * 7))));
      setTimeframe(diffWeeks);
      setCalendarOpen(false);
    }
  };

  const handleFinish = () => {
    if (!name.trim() || !startingWeight || !currentWeight || !targetWeight) return;
    onComplete({
      name: name.trim(),
      avatarSeed: selectedAvatar,
      startingWeight,
      currentWeight,
      targetWeight,
      timeframe,
      activityLevel,
      targetDate: format(targetDate, "yyyy-MM-dd"),
      age,
      heightCm: getHeightCm(),
      sex,
    });
  };

  const canAdvanceWizard = (): boolean => {
    switch (wizardStep) {
      case "name": return name.trim().length > 0;
      case "about": return !!age && age > 0 && age < 120 && !!sex;
      case "height": return getHeightCm() !== null && (getHeightCm() ?? 0) > 50;
      case "weight": return !!startingWeight && startingWeight > 0 && !!currentWeight && currentWeight > 0 && !!targetWeight && targetWeight > 0;
      case "activity": return true;
      case "timeline": return true;
      case "avatar": return true;
    }
  };

  const handleWizardNext = () => {
    if (!canAdvanceWizard()) return;
    const idx = WIZARD_STEPS.indexOf(wizardStep);
    if (idx < WIZARD_STEPS.length - 1) {
      setWizardStep(WIZARD_STEPS[idx + 1]);
    }
  };

  const handleWizardBack = () => {
    const idx = WIZARD_STEPS.indexOf(wizardStep);
    if (idx > 0) setWizardStep(WIZARD_STEPS[idx - 1]);
  };

  const stepIndex = WIZARD_STEPS.indexOf(wizardStep);

  const stepTitle: Record<WizardStep, string> = {
    name: "Let's get started!",
    about: "Tell us about you",
    height: "How tall are you?",
    weight: "Your weight goals",
    activity: "Activity level",
    timeline: "Set your timeline",
    avatar: "Choose your avatar",
  };

  const stepDesc: Record<WizardStep, string> = {
    name: "First, what should we call you?",
    about: "This helps us calculate your exact calorie needs.",
    height: "Your height is used to calculate your metabolic rate.",
    weight: "Enter your starting, current, and goal weights.",
    activity: "How active are you on a typical week?",
    timeline: "When would you like to reach your goal?",
    avatar: "Pick an avatar that represents you.",
  };

  const calendarSection = (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Timeframe</Label>
        <span className="text-sm font-semibold text-secondary">{timeframe} weeks</span>
      </div>
      <input
        type="range" min="1" max="52" value={timeframe}
        onChange={(e) => handleTimeframeSlider(Number(e.target.value))}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-secondary"
        data-testid="slider-onboard-timeframe"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Aggressive</span><span>Steady</span>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
        <button
          onClick={() => setCalendarOpen(!calendarOpen)}
          className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 transition-all text-left group"
          data-testid="button-target-date-picker"
        >
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
            <CalendarDays className="h-4 w-4 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Target Date</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{format(targetDate, "MMMM d, yyyy")}</p>
          </div>
          <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${calendarOpen ? "rotate-90" : ""}`} />
        </button>
        {calendarOpen && (
          <div className="border-t border-slate-200 dark:border-slate-700 p-3">
            {(() => {
              const today = startOfDay(new Date());
              const maxDate = addWeeks(today, 52);
              const monthStart = startOfMonth(calendarMonth);
              const monthEnd = endOfMonth(calendarMonth);
              const calStart = startOfWeek(monthStart);
              const calEnd = endOfWeek(monthEnd);
              const days = eachDayOfInterval({ start: calStart, end: calEnd });
              const canGoPrev = isAfter(monthStart, startOfMonth(today));
              const canGoNext = isBefore(endOfMonth(calendarMonth), startOfMonth(maxDate));
              const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
              return (
                <div className="select-none">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => canGoPrev && setCalendarMonth(subMonths(calendarMonth, 1))}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${canGoPrev ? "hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300" : "text-slate-300 dark:text-slate-600 cursor-not-allowed"}`}
                      disabled={!canGoPrev} data-testid="calendar-prev-month">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide">{format(calendarMonth, "MMMM yyyy")}</span>
                    <button onClick={() => canGoNext && setCalendarMonth(addMonths(calendarMonth, 1))}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${canGoNext ? "hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300" : "text-slate-300 dark:text-slate-600 cursor-not-allowed"}`}
                      disabled={!canGoNext} data-testid="calendar-next-month">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 mb-1">
                    {weekdays.map(d => (
                      <div key={d} className="text-center text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-1.5">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-0.5">
                    {days.map(day => {
                      const inMonth = isSameMonth(day, calendarMonth);
                      const isSelected = isSameDay(day, targetDate);
                      const isToday = isSameDay(day, today);
                      const isDisabled = isBefore(day, today) || isAfter(day, maxDate);
                      return (
                        <button key={day.toISOString()} onClick={() => !isDisabled && handleDateSelect(day)} disabled={isDisabled}
                          className={`relative h-9 w-full rounded-lg text-sm font-medium transition-all
                            ${!inMonth ? "text-slate-300 dark:text-slate-700" : ""}
                            ${inMonth && !isSelected && !isDisabled ? "text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary" : ""}
                            ${isDisabled && inMonth ? "text-slate-300 dark:text-slate-600 cursor-not-allowed" : ""}
                            ${isSelected ? "bg-primary text-white font-bold shadow-sm shadow-primary/30" : ""}
                            ${isToday && !isSelected ? "ring-1 ring-primary/40 text-primary font-semibold" : ""}`}
                          data-testid={`calendar-day-${format(day, "yyyy-MM-dd")}`}>
                          {day.getDate()}
                          {isToday && !isSelected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );

  const heightSection = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Unit</Label>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
          {(["imperial", "cm"] as const).map((u) => (
            <button key={u} onClick={() => setHeightUnit(u)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${heightUnit === u ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>
              {u === "imperial" ? "ft / in" : "cm"}
            </button>
          ))}
        </div>
      </div>
      {heightUnit === "cm" ? (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Height (cm)</Label>
          <Input
            type="text" inputMode="numeric" pattern="[0-9]*"
            placeholder="e.g. 175"
            value={heightCmInput ?? ""}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, "");
              const n = v === "" ? null : Number(v);
              setHeightCmInput(n);
              if (n) { const { ft, inches } = cmToFeetInches(n); setHeightFt(ft); setHeightIn(inches); }
            }}
            className="h-12 text-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium"
            data-testid="input-height-cm"
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Height (feet &amp; inches)</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Feet</Label>
              <Input
                type="text" inputMode="numeric" pattern="[0-9]*"
                placeholder="5"
                value={heightFt ?? ""}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "");
                  const n = v === "" ? null : Number(v);
                  setHeightFt(n);
                  if (n !== null) { const cm = feetInchesToCm(n, heightIn ?? 0); setHeightCmInput(Math.round(cm)); }
                }}
                className="h-12 text-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium"
                data-testid="input-height-ft"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Inches</Label>
              <Input
                type="text" inputMode="numeric" pattern="[0-9]*"
                placeholder="10"
                value={heightIn ?? ""}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  const n = raw === "" ? null : Math.min(11, Number(raw));
                  setHeightIn(n);
                  if (heightFt !== null && n !== null) { const cm = feetInchesToCm(heightFt, n); setHeightCmInput(Math.round(cm)); }
                }}
                className="h-12 text-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium"
                data-testid="input-height-in"
              />
            </div>
          </div>
        </div>
      )}
      {getHeightCm() && (getHeightCm() ?? 0) > 50 && (
        <p className="text-xs text-muted-foreground text-center">
          {heightUnit === "imperial" ? `${getHeightCm()} cm` : (() => { const { ft, inches } = cmToFeetInches(getHeightCm()!); return `${ft}′ ${inches}″`; })()}
        </p>
      )}
    </div>
  );

  const weightFields = (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: "Starting (lbs)", val: startingWeight, set: (n: number | null) => setStartingWeight(n), id: "input-onboard-starting-weight" },
        { label: "Current (lbs)", val: currentWeight, set: (n: number | null) => setCurrentWeight(n), id: "input-onboard-current-weight" },
        { label: "Target (lbs)", val: targetWeight, set: (n: number | null) => setTargetWeight(n), id: "input-onboard-target-weight" },
      ].map(({ label, val, set, id }) => (
        <div key={label} className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{label}</Label>
          <Input
            type="text" inputMode="numeric" pattern="[0-9]*"
            value={val ?? ""}
            onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); set(v === "" ? null : Number(v)); }}
            className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-semibold"
            data-testid={id}
          />
        </div>
      ))}
    </div>
  );

  const activityGrid = (
    <div className="grid grid-cols-2 gap-2">
      {activityLevels.map((level) => {
        const Icon = level.icon;
        const isSelected = activityLevel === level.value;
        return (
          <button key={level.value} onClick={() => setActivityLevel(level.value)}
            className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${isSelected ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"}`}
            data-testid={`activity-level-${level.value}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-primary/10" : "bg-slate-100 dark:bg-slate-700"}`}>
              <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : level.color}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-slate-700 dark:text-slate-300"}`}>{level.label}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{level.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );

  const avatarGrid = (
    <div className="grid grid-cols-6 gap-2">
      {avatarOptions.map(({ seed }) => (
        <button key={seed} onClick={() => setSelectedAvatar(seed)}
          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedAvatar === seed ? "border-primary shadow-sm shadow-primary/20 scale-105" : "border-transparent hover:border-primary/30"}`}
          data-testid={`avatar-option-${seed}`}>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt={seed} className="w-full h-full bg-white" />
        </button>
      ))}
    </div>
  );

  if (editMode) {
    const canFinishEdit = name.trim().length > 0 && !!startingWeight && startingWeight > 0 && !!currentWeight && currentWeight > 0 && !!targetWeight && targetWeight > 0;
    return (
      <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen && onClose) onClose(); }}>
        <DialogContent className="max-w-md p-0 overflow-hidden max-h-[90dvh] flex flex-col">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4 shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-primary tracking-tight">CalorieZone</span>
            </div>
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl font-display">
                {editStep === "profile" ? "Settings" : "Update your avatar"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {editStep === "profile" ? "Update your profile and weight goals." : "Pick a new avatar that represents you."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 space-y-5 overflow-y-auto flex-1 min-h-0 pb-2">
            {editStep === "profile" && (
              <>
                <button onClick={() => setEditStep("avatar")}
                  className="flex items-center gap-3 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                  data-testid="button-avatar-preview">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar}`} alt="Current avatar"
                    className="h-12 w-12 rounded-full bg-white border-2 border-primary/20 shadow-sm group-hover:border-primary/40 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{name || "Your Avatar"}</p>
                    <p className="text-xs text-muted-foreground">Tap to change avatar</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>

                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your first name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value.slice(0, 7))} maxLength={7}
                    placeholder="Enter your first name"
                    className="text-lg h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium"
                    data-testid="input-onboarding-name" />
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">About You</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Age (years)</Label>
                      <Input type="text" inputMode="numeric" pattern="[0-9]*"
                        placeholder="e.g. 30" value={age ?? ""}
                        onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); setAge(v === "" ? null : Number(v)); }}
                        className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-semibold"
                        data-testid="input-age" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Sex</Label>
                      <div className="grid grid-cols-1 gap-1">
                        {sexOptions.map((opt) => (
                          <button key={opt.value} onClick={() => setSex(opt.value)}
                            className={`px-2 py-1 rounded-lg border text-xs font-medium transition-all text-left ${sex === opt.value ? "border-primary bg-primary/5 text-primary" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}
                            data-testid={`sex-option-${opt.value}`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {heightSection}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Weight Goals</p>
                  {weightFields}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Daily Activity Level</p>
                  {activityGrid}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                  {calendarSection}
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      {darkMode ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">Switch to a darker theme</p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={(v) => { setDarkMode(v); document.documentElement.classList.toggle("dark", v); }} data-testid="switch-dark-mode" />
                </div>
              </>
            )}

            {editStep === "avatar" && (
              <>
                <div className="flex justify-center mb-2">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar}`} alt="Selected avatar"
                    className="h-20 w-20 rounded-full bg-white border-4 border-primary/20 shadow-md" />
                </div>
                {avatarGrid}
              </>
            )}
          </div>

          <div className="px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-2">
            {editStep === "avatar" && (
              <Button variant="outline" onClick={() => setEditStep("profile")} className="flex items-center gap-1.5">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
            )}
            <Button onClick={editStep === "profile" ? handleFinish : handleFinish}
              disabled={!canFinishEdit}
              className="flex-1 bg-primary hover:bg-primary/90 text-white h-11"
              data-testid="button-onboarding-finish">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen && onClose) onClose(); }}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden flex flex-col [&>button]:hidden"
        style={{ maxHeight: keyboardHeight > 0 ? `${window.innerHeight - keyboardHeight - 24}px` : "88svh" }}
      >
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-primary tracking-tight">CalorieZone</span>
            </div>
            <a href="/tutorial" className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors" data-testid="link-onboarding-guide">
              <HelpCircle className="h-3.5 w-3.5" /> How it works
            </a>
          </div>

          <div className="flex gap-1 mb-4">
            {WIZARD_STEPS.map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= stepIndex ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`} />
            ))}
          </div>

          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-display">{stepTitle[wizardStep]}</DialogTitle>
            <DialogDescription className="text-sm">{stepDesc[wizardStep]}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 space-y-5 overflow-y-auto flex-1 min-h-0 pb-6">
          {wizardStep === "name" && (
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your first name</Label>
              <Input
                value={name} onChange={(e) => setName(e.target.value.slice(0, 7))} maxLength={7}
                placeholder="Enter your first name"
                onKeyDown={(e) => e.key === "Enter" && handleWizardNext()}
                className="text-lg h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium"
                data-testid="input-onboarding-name" />
            </div>
          )}

          {wizardStep === "about" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Age (years)</Label>
                <Input type="text" inputMode="numeric" pattern="[0-9]*"
                  placeholder="e.g. 30" value={age ?? ""}
                  onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); setAge(v === "" ? null : Number(v)); }}
                  className="text-lg h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium"
                  data-testid="input-age" autoFocus />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sex</Label>
                <div className="grid grid-cols-2 gap-2">
                  {sexOptions.map((opt) => (
                    <button key={opt.value} onClick={() => setSex(opt.value)}
                      className={`p-3 rounded-xl border text-sm font-semibold transition-all ${sex === opt.value ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20 text-primary" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"}`}
                      data-testid={`sex-option-${opt.value}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {wizardStep === "height" && heightSection}

          {wizardStep === "weight" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">All values in pounds (lbs)</p>
              {weightFields}
            </div>
          )}

          {wizardStep === "activity" && activityGrid}
          {wizardStep === "timeline" && calendarSection}

          {wizardStep === "avatar" && (
            <>
              <div className="flex justify-center mb-2">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar}`} alt="Selected avatar"
                  className="h-20 w-20 rounded-full bg-white border-4 border-primary/20 shadow-md" />
              </div>
              {avatarGrid}
            </>
          )}
        </div>

        <div className="px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-2">
          {stepIndex > 0 && (
            <Button variant="outline" onClick={handleWizardBack} className="flex items-center gap-1.5" data-testid="button-wizard-back">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          )}
          {wizardStep !== "avatar" ? (
            <Button onClick={handleWizardNext} disabled={!canAdvanceWizard()}
              className="flex-1 bg-primary hover:bg-primary/90 text-white h-11 flex items-center justify-center gap-1.5"
              data-testid="button-wizard-next">
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish}
              disabled={!name.trim() || !startingWeight || !currentWeight || !targetWeight}
              className="flex-1 bg-primary hover:bg-primary/90 text-white h-11"
              data-testid="button-onboarding-finish">
              Get Started
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
