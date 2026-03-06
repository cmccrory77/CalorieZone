import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, ChevronRight } from "lucide-react";

interface OnboardingDialogProps {
  open: boolean;
  onComplete: (name: string, avatarSeed: string) => void;
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
];

export default function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("Felix");
  const [step, setStep] = useState<"name" | "avatar">("name");

  const handleNext = () => {
    if (step === "name" && name.trim()) {
      setStep("avatar");
    }
  };

  const handleFinish = () => {
    if (name.trim()) {
      onComplete(name.trim(), selectedAvatar);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm p-0 overflow-hidden [&>button]:hidden">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-primary tracking-tight">Caloriq</span>
          </div>
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-display">
              {step === "name" ? "What's your name?" : "Choose your avatar"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {step === "name"
                ? "We'll use this to personalize your experience."
                : "Pick an avatar that represents you."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {step === "name" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="onboarding-name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Your first name
                </Label>
                <Input
                  id="onboarding-name"
                  placeholder="Enter your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  className="text-lg h-12 bg-slate-50 border-slate-200 font-medium"
                  autoFocus
                  data-testid="input-onboarding-name"
                />
              </div>
              <Button
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold gap-2"
                onClick={handleNext}
                disabled={!name.trim()}
                data-testid="button-onboarding-next"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {step === "avatar" && (
            <>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatar}`}
                  alt="Selected avatar"
                  className="h-16 w-16 rounded-full bg-white border-2 border-primary/20 shadow-sm"
                />
                <div>
                  <p className="font-semibold text-slate-800">Hi, {name}!</p>
                  <p className="text-sm text-muted-foreground">Looking great with this avatar</p>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.seed}
                    onClick={() => setSelectedAvatar(avatar.seed)}
                    className={`relative p-1 rounded-xl transition-all ${
                      selectedAvatar === avatar.seed
                        ? "ring-2 ring-primary bg-primary/5 scale-105"
                        : "hover:bg-slate-50 hover:scale-105"
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

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => setStep("name")}
                  data-testid="button-onboarding-back"
                >
                  Back
                </Button>
                <Button
                  className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
                  onClick={handleFinish}
                  data-testid="button-onboarding-finish"
                >
                  Get Started
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
