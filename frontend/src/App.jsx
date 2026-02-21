// frontend/src/App.jsx
import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import rollbar, { logError } from './lib/rollbar';
import { env } from './config';

// Компонент для глобальной обработки ошибок
class GlobalErrorHandler extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Логируем ошибку в Rollbar
    logError(error, { errorInfo, component: 'GlobalErrorHandler' });
  }

  render() {
    return this.props.children;
  }
}

const rollbarConfig = {
  accessToken: env.rollbarToken,
  environment: env.mode,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: env.isProduction,
};

function App() {
  return (
    <RollbarProvider instance={rollbar} config={rollbarConfig}>
      <BrowserRouter>
        <AuthProvider>
          <GlobalErrorHandler>
            <div className="d-flex flex-column h-100">
              <Header />
              <div className="flex-grow-1">
                <ErrorBoundary
                  fallback={({ error, errorInfo }) => (
                    <div className="container mt-5">
                      <div className="alert alert-danger">
                        <h4 className="alert-heading">Что-то пошло не так</h4>
                        <p>Мы уже знаем об этой ошибке и работаем над её исправлением.</p>
                        <hr />
                        <p className="mb-0">Пожалуйста, попробуйте обновить страницу.</p>
                      </div>
                    </div>
                  )}
                  onError={(error, errorInfo) => {
                    logError(error, { errorInfo, component: 'AppErrorBoundary' });
                  }}
                >
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <ChatPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </ErrorBoundary>
              </div>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </GlobalErrorHandler>
        </AuthProvider>
      </BrowserRouter>
    </RollbarProvider>
  );
}

export default App;