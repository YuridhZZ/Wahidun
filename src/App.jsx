import './App.css'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TransactionProvider } from './contexts/TransactionContext';

// Import all your pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import PageNotFound from './pages/PageNotFound';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import ActivityLogPage from './pages/ActivityLog';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Layout from './components/Layout';
import AnalyticsPage from './pages/AnalyticsPage';
import TransferWizardPage from './pages/TransferWizardPage';
import CategorizePage from './pages/CategorizePage';

// Define ProtectedRoute, GuestRoute, and AdminRoute here
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

function AdminRoute({ children }) {
    const { isAdmin, isAuthenticated } = useAuth();
    return isAuthenticated && isAdmin ? children : <Navigate to="/admin-dashboard" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          
          <Route path="/" element={<ProtectedRoute><LayoutWrapper /></ProtectedRoute>}>
          
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/transfer-wizard" element={<TransferWizardPage />} />
            <Route path="/transactions/lists" element={<Transactions />} />
            <Route path="/categorize" element={<CategorizePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/activity-log" element={<ActivityLogPage />} />
            <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route index element={<DashboardPage />} />
          </Route>
          
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

function LayoutWrapper() {
  const { user } = useAuth();
  return (
    <TransactionProvider userId={user?.id}>
      <Layout>
        <Outlet />
      </Layout>
    </TransactionProvider>
  );
}

export default App;