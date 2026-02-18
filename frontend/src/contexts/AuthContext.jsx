// frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ token, username });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/v1/login', {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      setUser({ token, username });

      return { success: true };
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Неверные имя пользователя или пароль'
        };
      }
      return {
        success: false,
        error: 'Ошибка сети. Попробуйте позже.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};