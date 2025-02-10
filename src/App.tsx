
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import Index from "./pages/Index";
import PartnersPage from "./pages/partners/Index";
import TendersPage from "./pages/tenders/Index";
import ProcurementPage from "./pages/procurement/Index";
import EvaluationPage from "./pages/evaluation/Index";
import ClarificationsPage from "./pages/clarifications/Index";
import ComplaintsPage from "./pages/complaints/Index";
import PostContractPage from "./pages/post-contract/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <BrowserRouter>
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/tenders" element={<TendersPage />} />
              <Route path="/procurement" element={<ProcurementPage />} />
              <Route path="/evaluation" element={<EvaluationPage />} />
              <Route path="/clarifications" element={<ClarificationsPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/post-contract" element={<PostContractPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

