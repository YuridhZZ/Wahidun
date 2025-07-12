import { createContext, useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = user !== null;

  const login = async (credentials) => {
    try {
      const response = await fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user');
      const users = await response.json();

      const foundUser = users.find(u =>
        u.email === credentials.email && u.password === credentials.password
      );

      if (foundUser) {
        setUser(foundUser);
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
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      // Validate terms accepted
      if (!formData.termsAccepted) {
        return { success: false, message: 'You must accept the terms and conditions' };
      }

      // Prepare user data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        accountType: formData.accountType,
        balance : 1000000,
        createdAt: new Date().toISOString()
      };

      // Mock API call - in a real app, this would be a POST request to your backend
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
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}