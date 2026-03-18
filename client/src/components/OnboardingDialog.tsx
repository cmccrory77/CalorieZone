import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Activity, ChevronRight, ChevronLeft, CalendarDays, Moon, Sun, Armchair, Footprints, Bike, Flame } from "lucide-react";
import { addWeeks, addMonths, subMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, startOfDay } from "date-fns";

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
  editMode?: boolean;
}

const avatarOptions = [
  { seed: "Felix", label: "Felix" },
  { seed: "Aneka", label: "Aneka" },
  { seed: "Mia", label: "Mia" },
  { seed: "Leo", label: "Leo" },
  { seed: "Jade", label: "Jade" },
  { seed: "Riley", label: "Riley" },
  { seed: "Kai", label: "Kai" },
  { seed: "Zara", label: "Zara" },
  { seed: "Niko", label: "Niko" },
  { seed: "Luna", label: "Luna" },
  { seed: "Avery", label: "Avery" },
  { seed: "Sam", label: "Sam" },
  { seed: "Marcus", label: "Marcus" },
  { seed: "Priya", label: "Priya" },
  { seed: "Hiro", label: "Hiro" },
  { seed: "Amara", label: "Amara" },
  { seed: "Devon", label: "Devon" },
  { seed: "Rosa", label: "Rosa" },
  { seed: "Jamal", label: "Jamal" },
  { seed: "Suki", label: "Suki" },
  { seed: "Omar", label: "Omar" },
  { seed: "Ling", label: "Ling" },
  { seed: "Carlos", label: "Carlos" },
  { seed: "Fatima", label: "Fatima" },
  { seed: "Henrik", label: "Henrik" },
  { seed: "Yuki", label: "Yuki" },
  { seed: "Dante", label: "Dante" },
  { seed: "Nadia", label: "Nadia" },
  { seed: "Ravi", label: "Ravi" },
  { seed: "Elena", label: "Elena" },
  { seed: "Kwame", label: "Kwame" },
  { seed: "Sophie", label: "Sophie" },
  { seed: "Jin", label: "Jin" },
  { seed: "Anika", label: "Anika" },
  { seed: "Mateo", label: "Mateo" },
  { seed: "Ingrid", label: "Ingrid" },
];

const activityLevels = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise, desk job", icon: Armchair, color: "text-slate-500" },
  { value: "moderate", label: "Moderate", description: "Light exercise 1–3 days/week", icon: Footprints, color: "text-blue-500" },
  { value: "active", label: "Active", description: "Exercise 3–5 days/week", icon: Bike, color: "text-green-500" },
  { value: "very_active", label: "Very Active", description: "Hard exercise 6–7 days/week", icon: Flame, color: "text-orange-500" },
];

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
  editMode
}: OnboardingDialogProps) {
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
  const [step, setStep] = useState<"profile" | "avatar">("profile");

  useEffect(() => {
    if (open) {
      setName(initialName || "");
      setSelectedAvatar(initialAvatar || "Felix");
      setStartingWeight(initialStartingWeight ?? null);
      setCurrentWeight(initialCurrentWeight ?? null);
      setTargetWeight(initialTargetWeight ?? null);
      setTimeframe(initialTimeframe || 12);
      setActivityLevel(initialActivityLevel || "moderate");
      const initDate = initialTargetDate ? new Date(initialTargetDate + "T00:00:00") : addWeeks(new Date(), initialTimeframe || 12);
      setTargetDate(initDate);
      setCalendarMonth(initDate);
      setCalendarOpen(false);
      setStep("profile");
    }
  }, [open, initialName, initialAvatar, initialStartingWeight, initialCurrentWeight, initialTargetWeight, initialTimeframe, initialTargetDate, initialActivityLevel]);

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

  const handleNext = () => {
    if (step === "profile" && name.trim()) {
      setStep("avatar");
    }
  };

  const handleFinish = () => {
    if (name.trim() && startingWeight && startingWeight > 0 && currentWeight && currentWeight > 0 && targetWeight && targetWeight > 0) {
      onComplete({
        name: name.trim(),
        avatarSeed: selectedAvatar,
        startingWeight,
        currentWeight,
        targetWeight,
        timeframe,
        activityLevel,
        targetDate: format(targetDate, "yyyy-MM-dd"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen && onClose) onClose(); }}>
      <DialogContent className={`max-w-md p-0 overflow-hidden max-h-[90dvh] flex flex-col ${!editMode ? "[&>button]:hidden" : ""}`}>
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4 shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-primary tracking-tight">CalorieZone</span>
          </div>
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-display">
              {step === "profile"
                ? (editMode ? "Settings" : "Let's get started!")
                : (editMode ? "Update your avatar" : "Choose your avatar")}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {step === "profile"
                ? (editMode ? "Update your profile and weight goals." : "Tell us about yourself and your goals.")
                : (editMode ? "Pick a new avatar that represents you." : "Pick an avatar that represents you.")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 space-y-5 overflow-y-auto flex-1 min-h-0 pb-2">
          {step === "profile" && (
            <>
              {editMode && (
                <button
                  onClick={() => setStep("avatar")}
                  className="flex items-center gap-3 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                  data-testid="button-avatar-preview"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar}`}
                    alt="Current avatar"
                    className="h-12 w-12 rounded-full bg-white border-2 border-primary/20 shadow-sm group-hover:border-primary/40 transition-colors"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{name || "Your Avatar"}</p>
                    <p className="text-xs text-muted-foreground">Tap to change avatar</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              )}
              <div className="space-y-2">
                <Label htmlFor="onboarding-name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Your first name
                </Label>
                <Input
                  id="onboarding-name"
                  placeholder="Enter your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 7))}
                  maxLength={7}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  className="text-lg h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium"
                  data-testid="input-onboarding-name"
                />
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Weight Goals</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="onboard-starting" className="text-xs text-muted-foreground">Starting (lbs)</Label>
                    <Input
                      id="onboard-starting"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder=""
                      value={startingWeight ?? ""}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, "");
                        setStartingWeight(v === "" ? null : Number(v));
                      }}
                      className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-semibold"
                      data-testid="input-onboard-starting-weight"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="onboard-current" className="text-xs text-muted-foreground">Current (lbs)</Label>
                    <Input
                      id="onboard-current"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder=""
                      value={currentWeight ?? ""}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, "");
                        setCurrentWeight(v === "" ? null : Number(v));
                      }}
                      className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-semibold"
                      data-testid="input-onboard-current-weight"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="onboard-target" className="text-xs text-muted-foreground">Target (lbs)</Label>
                    <Input
                      id="onboard-target"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder=""
                      value={targetWeight ?? ""}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, "");
                        setTargetWeight(v === "" ? null : Number(v));
                      }}
                      className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-semibold"
                      data-testid="input-onboard-target-weight"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Daily Activity Level</p>
                <div className="grid grid-cols-2 gap-2">
                  {activityLevels.map((level) => {
                    const Icon = level.icon;
                    const isSelected = activityLevel === level.value;
                    return (
                      <button
                        key={level.value}
                        onClick={() => setActivityLevel(level.value)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                          isSelected
                            ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                            : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                        data-testid={`activity-level-${level.value}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-primary/10" : "bg-slate-100 dark:bg-slate-700"
                        }`}>
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
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Timeframe
                  </Label>
                  <span className="text-sm font-semibold text-secondary">{timeframe} weeks</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="52"
                  value={timeframe}
                  onChange={(e) => handleTimeframeSlider(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-secondary"
                  data-testid="slider-onboard-timeframe"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Aggressive</span>
                  <span>Steady</span>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  <button
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 transition-all text-left group"
                    data-testid="button-target-date-picker"
                  >
                    <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                      <CalendarDays className="h-4.5 w-4.5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Target Date</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{format(targetDate, "MMMM d, yyyy")}</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${calendarOpen ? 'rotate-90' : ''}`} />
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
                              <button
                                onClick={() => canGoPrev && setCalendarMonth(subMonths(calendarMonth, 1))}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                  canGoPrev
                                    ? "hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
                                    : "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                }`}
                                disabled={!canGoPrev}
                                data-testid="calendar-prev-month"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide">
                                {format(calendarMonth, "MMMM yyyy")}
                              </span>
                              <button
                                onClick={() => canGoNext && setCalendarMonth(addMonths(calendarMonth, 1))}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                  canGoNext
                                    ? "hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
                                    : "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                }`}
                                disabled={!canGoNext}
                                data-testid="calendar-next-month"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-7 mb-1">
                              {weekdays.map(d => (
                                <div key={d} className="text-center text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-1.5">
                                  {d}
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-y-0.5">
                              {days.map(day => {
                                const inMonth = isSameMonth(day, calendarMonth);
                                const isSelected = isSameDay(day, targetDate);
                                const isToday = isSameDay(day, today);
                                const isDisabled = isBefore(day, today) || isAfter(day, maxDate);

                                return (
                                  <button
                                    key={day.toISOString()}
                                    onClick={() => !isDisabled && handleDateSelect(day)}
                                    disabled={isDisabled}
                                    className={`
                                      relative h-9 w-full rounded-lg text-sm font-medium transition-all
                                      ${!inMonth ? "text-slate-300 dark:text-slate-700" : ""}
                                      ${inMonth && !isSelected && !isDisabled ? "text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary" : ""}
                                      ${isDisabled && inMonth ? "text-slate-300 dark:text-slate-600 cursor-not-allowed" : ""}
                                      ${isSelected ? "bg-primary text-white font-bold shadow-sm shadow-primary/30" : ""}
                                      ${isToday && !isSelected ? "ring-1 ring-primary/40 text-primary font-semibold" : ""}
                                    `}
                                    data-testid={`calendar-day-${format(day, "yyyy-MM-dd")}`}
                                  >
                                    {day.getDate()}
                                    {isToday && !isSelected && (
                                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                                    )}
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

              {editMode && (
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      {darkMode ? (
                        <Moon className="h-4.5 w-4.5 text-indigo-400" />
                      ) : (
                        <Sun className="h-4.5 w-4.5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">Switch to a darker theme</p>
                    </div>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={(checked) => {
                      setDarkMode(checked);
                      if (checked) {
                        document.documentElement.classList.add("dark");
                        localStorage.setItem("caloriezone-dark-mode", "true");
                      } else {
                        document.documentElement.classList.remove("dark");
                        localStorage.setItem("caloriezone-dark-mode", "false");
                      }
                    }}
                    data-testid="switch-dark-mode"
                  />
                </div>
              )}

            </>
          )}

          {step === "avatar" && (
            <>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar}`}
                  alt="Selected avatar"
                  className="h-16 w-16 rounded-full bg-white border-2 border-primary/20 shadow-sm"
                />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Hi, {name}!</p>
                  <p className="text-sm text-muted-foreground">Looking great with this avatar</p>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2 max-h-[240px] overflow-y-auto pr-1">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.seed}
                    onClick={() => setSelectedAvatar(avatar.seed)}
                    className={`relative p-1 rounded-xl transition-all ${
                      selectedAvatar === avatar.seed
                        ? "ring-2 ring-primary bg-primary/5 scale-105"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105"
                    }`}
                    data-testid={`avatar-option-${avatar.seed}`}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar.seed}`}
                      alt={avatar.label}
                      className="w-full aspect-square rounded-lg"
                    />
                    {selectedAvatar === avatar.seed && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
          {step === "profile" && (
            editMode ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-11 px-5"
                  onClick={() => setStep("avatar")}
                  data-testid="button-change-avatar"
                >
                  Change Avatar
                </Button>
                <Button
                  className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
                  onClick={handleFinish}
                  disabled={!name.trim()}
                  data-testid="button-onboarding-update"
                >
                  Update
                </Button>
              </div>
            ) : (
              <Button
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold gap-2"
                onClick={handleNext}
                disabled={!name.trim()}
                data-testid="button-onboarding-next"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            )
          )}
          {step === "avatar" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={() => setStep("profile")}
                data-testid="button-onboarding-back"
              >
                Back
              </Button>
              <Button
                className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
                onClick={handleFinish}
                data-testid="button-onboarding-finish"
              >
                {editMode ? "Save Changes" : "Get Started"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
