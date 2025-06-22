import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const updateAuthState = useCallback((userData, userToken) => {
    
    const actualUserData = userData?.user || userData;
    
    setUser(actualUserData);
    setToken(userToken);
    setIsAuthenticated(!!actualUserData);
    setIsBusiness(actualUserData?.isBusiness || false);
    setIsAdmin(actualUserData?.isAdmin || false);
  }, []);

  const clearAuthState = useCallback(() => {    
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsBusiness(false);
    setIsAdmin(false);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      
      try {
        const storedToken = localStorage.getItem('token');        
        if (!storedToken) {
          console.log('[AuthContext] no token, clearing state');
          clearAuthState();
          return;
        }

        const decoded = jwtDecode(storedToken);
        
        if (decoded.exp <= Date.now() / 1000) {
          localStorage.removeItem('token');
          clearAuthState();
          return;
        }

        try {
          const response = await api.get('/users/me');
          const serverData = response.data?.data || response.data;
          
          updateAuthState(serverData, storedToken);
          
        } catch (serverError) {
          updateAuthState(decoded, storedToken);
        }
        
      } catch (error) {
        console.error('[AuthContext] loadUser error:', error);
        localStorage.removeItem('token');
        clearAuthState();
      }
    };

    const loadUserWithTimeout = async () => {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      try {
        await Promise.race([loadUser(), timeoutPromise]);
      } catch (error) {
        console.error('[AuthContext] loadUser timeout or error:', error);
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          try {
            const decoded = jwtDecode(storedToken);
            if (decoded.exp > Date.now() / 1000) {
              console.log('[AuthContext] using token data after timeout');
              updateAuthState(decoded, storedToken);
            } else {
              clearAuthState();
            }
          } catch {
            clearAuthState();
          }
        } else {
          clearAuthState();
        }
      } finally {
        console.log('[AuthContext] setting loading false');
        setLoading(false);
      }
    };

    loadUserWithTimeout();
  }, [updateAuthState, clearAuthState]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      const { data } = response;
      
      if (data.success && data.data.token) {
        localStorage.setItem('token', data.data.token);
        const serverData = data.data;
        
        updateAuthState(serverData, data.data.token);
        return serverData.user || serverData;
      }
      throw new Error('No token received');
    } catch (error) {
      console.error('[AuthContext] login error:', error);
      throw error;
    }
  }, [updateAuthState]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    clearAuthState();
  }, [clearAuthState]);

  const updateUser = useCallback((userData) => {
    const actualUserData = userData?.user || userData;
    setUser(actualUserData);
    setIsBusiness(actualUserData?.isBusiness || false);
    setIsAdmin(actualUserData?.isAdmin || false);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isBusiness,
    isAdmin,
    login,
    logout,
    loading,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};