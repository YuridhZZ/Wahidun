import './App.css'
import { AuthProvider, ProtectedRoute } from './contexts/authContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import PageNotFound from './pages/PageNotFound';
import TransactionListPage from './pages/TransactionListPage';
import TransactionForm from './pages/TransactionPage';

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction"
            element={
              <ProtectedRoute>
                <TransactionListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newTransaction"
            element={
              <ProtectedRoute>
                <TransactionForm />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App