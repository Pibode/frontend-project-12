// frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import socketService from '../services/socket';
import { setRollbarUser, clearRollbarUser, logError } from '../lib/rollbar';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      const userData = { token, username };
      setUser(userData);
      // Устанавливаем пользователя в Rollbar
      setRollbarUser(userData);
      // Подключаем сокет если есть токен
      socketService.connect(token);
    }
    setLoading(false);

    // Отключаем сокет при размонтировании если пользователь не залогинен
    return () => {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        socketService.disconnect();
        clearRollbarUser();
      }
    };
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/v1/login', {
        username,
        password,
      });

      const { token } = response.data;
      const userData = { token, username };
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      setUser(userData);
      
      // Устанавливаем пользователя в Rollbar
      setRollbarUser(userData);

      // Подключаем сокет после успешного входа
      socketService.connect(token);

      return { success: true };
    } catch (error) {
      logError(error, { action: 'login', username });
      
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
    // Отключаем сокет при выходе
    socketService.disconnect();
    
    // Очищаем пользователя в Rollbar
    clearRollbarUser();

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