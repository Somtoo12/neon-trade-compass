
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Calculators from "./pages/Calculators";
import SessionClock from "@/components/tools/SessionClock";
import CurrencyHeatmap from "@/components/tools/CurrencyHeatmap";
import RiskManagement from "@/components/tools/RiskManagement";
import ForexCalculator from "@/components/calculators/ForexCalculator";
import CryptoCalculator from "@/components/calculators/CryptoCalculator";
import FuturesCalculator from "@/components/calculators/FuturesCalculator";
import TradeJournal from "@/components/calculators/TradeJournal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/forex-calculator" />} />
            <Route path="/forex-calculator" element={<Index activeSection="forex-calculator" />} />
            <Route path="/crypto-calculator" element={<Index activeSection="crypto-calculator" />} />
            <Route path="/futures-calculator" element={<Index activeSection="futures-calculator" />} />
            <Route path="/session-clock" element={<Index activeSection="session-clock" />} />
            <Route path="/currency-heatmap" element={<Index activeSection="currency-heatmap" />} />
            <Route path="/risk-management" element={<Index activeSection="risk-management" />} />
            <Route path="/trade-journal" element={<Index activeSection="trade-journal" />} />
            <Route path="/daily-trade-tools" element={<Index activeSection="daily-trade-tools" />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
