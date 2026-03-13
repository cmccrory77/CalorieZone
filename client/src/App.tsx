import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function DebugBanner() {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99999,
      background: 'red', color: 'white', textAlign: 'center',
      padding: '4px', fontSize: '11px', fontWeight: 'bold'
    }}>
      BUILD 2026-03-13T17:15 | {window.location.origin} | {navigator.userAgent.includes('iPhone') ? 'iOS' : 'Web'}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <DebugBanner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;