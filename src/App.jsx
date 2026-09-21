import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ReportIssueWizard from './components/ReportIssueWizard';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import TransparencyDashboard from './components/TransparencyDashboard';
import AuthModal from './components/AuthModal';
import { getCurrentUser, toggleUserRole } from './services/auth';
import { getReports } from './services/db';

export default function App() {
  const [activePage, setActivePage] = useState('landing'); // 'landing' | 'transparency' | 'report' | 'citizen' | 'admin'
  const [reportCount, setReportCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setReportCount(getReports().length);
  }, [activePage]);

  const handleReportSubmitted = () => {
    setReportCount(getReports().length);
  };

  const handleToggleRole = () => {
    const updated = toggleUserRole();
    setCurrentUser(updated);
    if (updated.role === 'admin') {
      setActivePage('admin');
    } else {
      setActivePage('citizen');
    }
  };

  return (
    <div className="civiclens-app">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        reportCount={reportCount}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onToggleRole={handleToggleRole}
      />

      <main className="content-container">
        {activePage === 'landing' && (
          <LandingPage 
            onReportClick={() => setActivePage('report')}
            onTrackClick={() => setActivePage('citizen')}
          />
        )}

        {activePage === 'transparency' && (
          <TransparencyDashboard />
        )}

        {activePage === 'report' && (
          <ReportIssueWizard 
            onReportSubmitted={handleReportSubmitted}
            onViewDashboard={() => setActivePage('citizen')}
          />
        )}

        {activePage === 'citizen' && (
          <CitizenDashboard 
            onNewReport={() => setActivePage('report')}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin') setActivePage('admin');
        }} 
      />
    </div>
  );
}
