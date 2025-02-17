
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import Index from "./pages/Index";
import CommitteePage from "./pages/CommitteePage";
import NotFound from "./pages/NotFound";
import TendersPage from "./pages/TendersPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProcurementPlanPage from "./pages/ProcurementPlanPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/committee/*" element={<CommitteePage />} />
            <Route path="/tenders" element={<TendersPage />} />
            <Route path="/procurement-plan" element={<ProcurementPlanPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
