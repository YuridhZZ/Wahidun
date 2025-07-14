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
    navigate('/login');
  };
  
  const register = async (formData) => {
    // ... your existing register logic ...
    // Ensure it returns { success: true, user: newUser } on success
  };

  const refreshUserData = useCallback(async () => {
    // ... your existing refreshUserData logic ...
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}