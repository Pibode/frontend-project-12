// frontend/src/pages/LoginPage.jsx
import { useFormik } from 'formik';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Alert, Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [authError, setAuthError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);

  useEffect(() => {
    if (location.state?.message) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError(null);
      setSuccessMessage(null);

      const result = await login(values.username, values.password);

      if (result.success) {
        navigate('/');
      } else {
        setAuthError(result.error === 'Неверные имя пользователя или пароль' 
          ? t('login.errors.invalid') 
          : t('login.errors.network'));
      }

      setSubmitting(false);
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4">{t('login.title')}</h2>

              {successMessage && (
                <Alert variant="success" className="mb-3">
                  {successMessage}
                </Alert>
              )}

              {authError && (
                <Alert variant="danger" className="mb-3">
                  {authError}
                </Alert>
              )}

              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('login.username')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    placeholder={t('login.username')}
                    autoFocus
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>{t('login.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    placeholder={t('login.password')}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mb-3"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? t('login.submitting') : t('login.submit')}
                </Button>

                <div className="text-center">
                  <span className="text-muted">{t('login.noAccount')} </span>
                  <Link to="/signup">{t('login.signup')}</Link>
                </div>
              </Form>

              <div className="mt-3 text-muted small text-center">
                <p className="mb-1">{t('login.testCredentials')}</p>
                <p className="mb-0">{t('login.username')}: admin, {t('login.password')}: admin</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;