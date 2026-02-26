// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider as RollbarProvider } from '@rollbar/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import AppErrorBoundary from './components/AppErrorBoundary'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import rollbar from './lib/rollbar'
import { env } from './config'

const rollbarConfig = {
  accessToken: env.rollbarToken,
  environment: env.mode,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: env.isProduction,
}

function GlobalErrorHandler({ children }) {
  return children
}

function App() {
  return (
    <RollbarProvider instance={rollbar} config={rollbarConfig}>
      <BrowserRouter>
        <AuthProvider>
          <GlobalErrorHandler>
            <div className="d-flex flex-column h-100">
              <Header />
              <div className="flex-grow-1 overflow-hidden">
                <AppErrorBoundary>
                  <Routes>
                    <Route
                      path="/"
                      element={(
                        <ProtectedRoute>
                          <ChatPage />
                        </ProtectedRoute>
                      )}
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AppErrorBoundary>
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
  )
}

export default App
