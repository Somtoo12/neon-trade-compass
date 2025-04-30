
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { HelmetProvider } from 'react-helmet-async';

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Calculators from "./pages/Calculators";
import HomePage from "./pages/HomePage";
import MaxLotSize from "./pages/MaxLotSize";
import FocusMode from "./pages/FocusMode";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/legal/TermsPage";
import PrivacyPage from "./pages/legal/PrivacyPage";
import DisclaimerPage from "./pages/legal/DisclaimerPage";
import ToolsPage from "./pages/ToolsPage";
import EconomicCalendar from "./pages/EconomicCalendar";

// Import new utility tool pages
import QRCodeGenerator from "./pages/utility-tools/QRCodeGenerator";
import CountdownTimer from "./pages/utility-tools/CountdownTimer";
import CharacterCounter from "./pages/utility-tools/CharacterCounter";
import TipCalculator from "./pages/utility-tools/TipCalculator";
import DateCalculator from "./pages/utility-tools/DateCalculator";
import RandomGenerator from "./pages/utility-tools/RandomGenerator";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/focus-mode" element={<FocusMode />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/forex-calculator" element={<Index activeSection="forex-calculator" />} />
              <Route path="/crypto-calculator" element={<Index activeSection="crypto-calculator" />} />
              <Route path="/futures-calculator" element={<Index activeSection="futures-calculator" />} />
              <Route path="/session-clock" element={<Index activeSection="session-clock" />} />
              <Route path="/currency-heatmap" element={<Index activeSection="currency-heatmap" />} />
              <Route path="/risk-management" element={<Index activeSection="risk-management" />} />
              <Route path="/max-lot-size" element={<MaxLotSize />} />
              <Route path="/trade-journal" element={<Index activeSection="trade-journal" />} />
              <Route path="/daily-trade-tools" element={<Index activeSection="daily-trade-tools" />} />
              <Route path="/challenge-blueprint" element={<Index activeSection="challenge-blueprint" />} />
              <Route path="/economic-calendar" element={<Index activeSection="economic-calendar" />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/trader-games" element={<Index activeSection="trader-games" />} />
              
              {/* New Utility Tool Routes */}
              <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
              <Route path="/countdown-timer" element={<CountdownTimer />} />
              <Route path="/character-counter" element={<CharacterCounter />} />
              <Route path="/tip-calculator" element={<TipCalculator />} />
              <Route path="/date-calculator" element={<DateCalculator />} />
              <Route path="/random-generator" element={<RandomGenerator />} />
              
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
