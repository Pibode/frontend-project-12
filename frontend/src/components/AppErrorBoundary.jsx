// frontend/src/components/AppErrorBoundary.jsx
import { ErrorBoundary } from '@rollbar/react'
import { logError } from '../lib/rollbar'

const AppErrorFallback = () => (
  <div className="container mt-5">
    <div className="alert alert-danger">
      <h4 className="alert-heading">Что-то пошло не так</h4>
      <p>Мы уже знаем об этой ошибке и работаем над её исправлением.</p>
      <hr />
      <p className="mb-0">Пожалуйста, попробуйте обновить страницу.</p>
    </div>
  </div>
)

const AppErrorBoundary = ({ children }) => (
  <ErrorBoundary
    fallback={AppErrorFallback}
    onError={(error, errorInfo) => {
      logError(error, { errorInfo, component: 'AppErrorBoundary' })
    }}
  >
    {children}
  </ErrorBoundary>
)

export default AppErrorBoundary
