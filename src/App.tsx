
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <BrowserRouter>
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route
                  path="/partners"
                  element={
                    <ProtectedRoute>
                      <PartnersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenders"
                  element={
                    <ProtectedRoute>
                      <TendersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/procurement"
                  element={
                    <ProtectedRoute>
                      <ProcurementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/evaluation"
                  element={
                    <ProtectedRoute>
                      <EvaluationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clarifications"
                  element={
                    <ProtectedRoute>
                      <ClarificationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/complaints"
                  element={
                    <ProtectedRoute>
                      <ComplaintsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/post-contract"
                  element={
                    <ProtectedRoute>
                      <PostContractPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
