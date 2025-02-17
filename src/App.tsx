
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import CommitteePage from '@/pages/CommitteePage';
import CommitteeDetail from '@/components/committee/CommitteeDetail';
import NotFound from '@/pages/NotFound';
import TendersPage from '@/pages/TendersPage';
import ProcurementPlanPage from '@/pages/ProcurementPlanPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SettingsPage from '@/pages/SettingsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/committee" element={<CommitteePage />} />
        <Route path="/committee/create" element={<CommitteePage />} />
        <Route path="/committees/:id" element={<CommitteeDetail />} />
        <Route path="/tenders" element={<TendersPage />} />
        <Route path="/procurement-plan" element={<ProcurementPlanPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
