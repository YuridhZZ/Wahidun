import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = user !== null;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
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
        localStorage.setItem('user', JSON.stringify(foundUser)); // nyimpen user di localStorage
        navigate('/dashboard');
        return { success: true };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
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
        accountNumber: new Date().toISOString(),
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
        localStorage.setItem('user', JSON.stringify(newUser)); // nyimpen user di localStorage
        navigate('/dashboard');
        return { success: true };
      } else {
        return { success: false, message: 'Registration failed. Please try again.' };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // menghapus user dari localStorage
    navigate('/login');
  };

  const updateUserBalance = (newBalance) => {
    const updatedUser = { ...user, balance: newBalance };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateUserBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
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