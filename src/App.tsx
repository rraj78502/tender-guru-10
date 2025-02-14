
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "./components/layout/Navigation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginForm from "./components/auth/LoginForm";
import CommitteeDetail from "./components/committee/CommitteeDetail";
import CommitteePage from "./pages/CommitteePage";
import TendersPage from "./pages/TendersPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/committee" element={<CommitteePage />} />
                <Route path="/committees/:id" element={<CommitteeDetail />} />
                <Route path="/tenders" element={<TendersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
