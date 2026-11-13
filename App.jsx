import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitComplaintPage from './pages/student/SubmitComplaintPage';
import MyComplaintsPage from './pages/student/MyComplaintsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

function AppContent() {
  const { isAuthenticated, isAdmin, isStudent, isLoading, login } = useAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle instant 1-click evaluation logins from landing page
  const handleQuickLogin = async (role) => {
    try {
      if (role === 'admin') {
        await login('admin@campus.edu', 'Admin@123');
        setCurrentView('admin-dashboard');
      } else {
        await login('john.doe@student.campus.edu', 'Student@123');
        setCurrentView('student-dashboard');
      }
    } catch (err) {
      console.error('Quick login error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Initializing Smart Campus Portal..." size="lg" />
      </div>
    );
  }

  // Unauthenticated Public Flow
  if (!isAuthenticated) {
    if (currentView === 'login') {
      return <LoginPage onNavigate={setCurrentView} />;
    }
    if (currentView === 'register') {
      return <RegisterPage onNavigate={setCurrentView} />;
    }
    return (
      <LandingPage
        onNavigate={setCurrentView}
        onQuickLogin={handleQuickLogin}
      />
    );
  }

  // Authenticated Portal Routing
  const renderPortalView = () => {
    if (isAdmin) {
      switch (currentView) {
        case 'admin-analytics':
          return <AdminAnalyticsPage />;
        case 'admin-complaints':
          return <AdminComplaintsPage />;
        case 'admin-dashboard':
        default:
          return <AdminDashboard onNavigate={setCurrentView} />;
      }
    } else {
      switch (currentView) {
        case 'submit-complaint':
          return <SubmitComplaintPage onNavigate={setCurrentView} />;
        case 'my-complaints':
          return <MyComplaintsPage onNavigate={setCurrentView} />;
        case 'student-dashboard':
        default:
          return <StudentDashboard onNavigate={setCurrentView} />;
      }
    }
  };

  const defaultView = isAdmin ? 'admin-dashboard' : 'student-dashboard';
  const activeView = currentView.startsWith(isAdmin ? 'admin' : 'student') || currentView === 'submit-complaint' || currentView === 'my-complaints'
    ? currentView
    : defaultView;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar
          currentView={activeView}
          onNavigate={(view) => setCurrentView(view)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderPortalView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
