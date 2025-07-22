import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Organizations from '../pages/Organizations';
import Members from '../pages/Members';
import Login from '../pages/Login';
import ActivitySubmission from '../pages/ActivitySubmission';
import ProposalApproval from '../pages/ProposalApproval';
import ReportUpload from '../pages/ReportUpload';
import MainLayout from '../layouts/MainLayout';
import { isLoggedIn } from '../services/auth';
import ProkerManagement from '../pages/ProkerManagement';
import History from '../pages/History';
import CalendarAdmin from '../pages/CalendarAdmin';
import AddProker from '../pages/AddProker';

function RequireAuth({ children }) {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

const AppRoutes = () => (
  <BrowserRouter>
    <MainLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/members" element={<Members />} />
                <Route path="/activity-submission" element={<ActivitySubmission />} />
                <Route path="/proposal-approval" element={<ProposalApproval />} />
                <Route path="/report-upload" element={<ReportUpload />} />
                <Route path="/proker-management" element={<ProkerManagement />} />
                <Route path="/history" element={<History />} />
                <Route path="/calendar-admin" element={<CalendarAdmin />} />
                <Route path="/add-proker/:orgId" element={<AddProker />} />
              </Routes>
            </RequireAuth>
          }
        />
      </Routes>
    </MainLayout>
  </BrowserRouter>
);

export default AppRoutes; 