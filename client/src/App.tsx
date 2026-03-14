import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Privacy from "@/pages/privacy";
import Support from "@/pages/support";
import { PremiumProvider } from "@/contexts/PremiumContext";
import UpgradeModal from "@/components/UpgradeModal";

function isCapacitor(): boolean {
  try {
    const w = window as any;
    return !!(w.Capacitor && w.Capacitor.isNativePlatform && w.Capacitor.isNativePlatform());
  } catch { return false; }
}

function Router() {
  const native = isCapacitor();
  return (
    <Switch>
      <Route path="/">{native ? <Redirect to="/app" /> : <Landing />}</Route>
      <Route path="/privacy" component={Privacy}/>
      <Route path="/support" component={Support}/>
      <Route path="/app" component={Home}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PremiumProvider>
        <TooltipProvider>
          <Toaster />
          <UpgradeModal />
          <Router />
        </TooltipProvider>
      </PremiumProvider>
    </QueryClientProvider>
  );
}

export default App;
