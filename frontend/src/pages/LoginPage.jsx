// frontend/src/pages/LoginPage.jsx
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authError, setAuthError] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError(null);
      
      const result = await login(values.username, values.password);
      
      if (result.success) {
        navigate('/');
      } else {
        setAuthError(result.error);
      }
      
      setSubmitting(false);
    },
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Войти</h2>
              
              {authError && (
                <Alert variant="danger" className="mb-3">
                  {authError}
                </Alert>
              )}
              
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Имя пользователя
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    disabled={formik.isSubmitting}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Пароль
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    disabled={formik.isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Вход...' : 'Войти'}
                </button>
              </form>

              <div className="mt-3 text-muted small">
                <p className="mb-1">Для теста используйте:</p>
                <p className="mb-0">username: admin, password: admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;