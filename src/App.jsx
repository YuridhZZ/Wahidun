import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AuthProvider, ProtectedRoute, GuestRoute } from './contexts/AuthContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { useAuth } from './contexts/AuthContext'
import { Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import PageNotFound from './pages/PageNotFound';
import TransactionForm from './pages/TransactionPage';
import Transactions from './pages/Transactions'
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ActivityLogPage from './pages/ActivityLog';
import CategorizePage from './pages/CategorizePage';
import TransferWizardPage from './pages/TransferWizardPage';

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/" element={<ProtectedRoute><LayoutWrapper /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transfer-wizard" element={<TransferWizardPage />} /> 
            <Route path="/transactions/new" element={<TransactionForm />} />
            <Route path="/transactions/lists" element={<Transactions />} />
            <Route path="/categorize" element={<CategorizePage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/activity-log" element={<ActivityLogPage />} />
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

export default App
