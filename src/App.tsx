
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import TendersPage from "@/pages/TendersPage";
import SettingsPage from "@/pages/SettingsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import CommitteePage from "@/pages/CommitteePage";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tenders" element={<TendersPage />} />
          <Route path="/committee" element={<CommitteePage />} />
          <Route path="/committee/create" element={<CommitteePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
