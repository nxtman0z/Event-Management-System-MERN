import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Load user from token on mount
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('eventflow_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.getMe();
      if (data.success) {
        setUser(data.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auto-login failed:', error.message);
      localStorage.removeItem('eventflow_token');
      localStorage.removeItem('eventflow_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Register
  const register = async (userData) => {
    try {
      const { data } = await authAPI.register(userData);
      if (data.success) {
        // Do not auto-login after register, user should log in explicitly
        toast.success('Registration successful! Please login. 🎉');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const { data } = await authAPI.login(credentials);
      if (data.success) {
        localStorage.setItem('eventflow_token', data.data.token);
        localStorage.setItem('eventflow_user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        setIsAuthenticated(true);
        toast.success(`Welcome back, ${data.data.user.name}! 👋`);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    // Navigate to home first so that the route changes
    navigate('/');
    
    // AnimatePresence in App.jsx keeps the previous route mounted for 300ms while animating out.
    // If we clear the auth state immediately, the unmounting ProtectedRoute will intercept 
    // and redirect to /login mid-animation. 
    // Delaying the state wipe by 400ms ensures the animation completes cleanly first.
    setTimeout(() => {
      localStorage.removeItem('eventflow_token');
      localStorage.removeItem('eventflow_user');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }, 400);
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('eventflow_user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateUser,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
