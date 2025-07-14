import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { generateAccountNumber } from '../utils/generateAccNumber';

// NOTE: useActivityLog is REMOVED from this file to fix the error.
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = user !== null;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.role === 'Admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user');
      const users = await response.json();
      const foundUser = users.find(u =>
        u.email === credentials.email && u.password === credentials.password 
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));

        if (foundUser.role === 'Admin') {
          setIsAdmin(true);
          navigate('/admin-dashboard');
        } else {
          setIsAdmin(false);
          navigate('/dashboard');
        }
        
        return { success: true, user: foundUser };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('Admin');
    // We don't clear the log here so the user can see "User signed out" before it disappears.
    // The log will be cleared upon the next user's login.
    navigate('/login');
  };
  
  const register = async (formData) => {
    try {
      if (formData.password !== formData.confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }
      if (!formData.termsAccepted) {
        return { success: false, message: 'You must accept the terms and conditions' };
      }
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        accountType: formData.accountType,
        accountNumber: generateAccountNumber(),
        balance: 1000000,
        createdAt: new Date().toISOString()
      };
      const response = await fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const newUser = await response.json();
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));

        // Clear any previous log and start a new one
        clearActivityLog();
        logActivity('New user registered and signed in');

        navigate('/dashboard');
        return { success: true };
      } else {
        return { success: false, message: 'Registration failed. Please try again.' };
      }
    } catch (error) {
      return { success: false, message: error.message || 'An unexpected error occurred.' };
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = useCallback(async () => {
    if (user?.id) {
      try {
        const response = await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user/${user.id}`);
        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
           throw new Error('Failed to refresh user data');
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthenticated, login, logout, register, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AdminRoute({ children }) {
  console.log("Admin route is rendered")
  const { isAuthenticated, isAdmin } = useAuth();
  console.log('AdminRoute render: isAuthenticated =', isAuthenticated, ', isAdmin =', isAdmin);
  if (!isAuthenticated) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    // User is authenticated but not an admin, redirect to an unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated AND is an admin, render the children
  return children;
}

export function ProtectedRoute({ children }) {
  console.log("User route is rendered")
  const { isAuthenticated, isAdmin} = useAuth();
  console.log('USerRoute render: isAuthenticated =', isAuthenticated, ', isAdmin =', isAdmin);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}



export function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}