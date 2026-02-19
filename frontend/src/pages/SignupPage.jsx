// frontend/src/pages/SignupPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);

  const validationSchema = yup.object({
    username: yup
      .string()
      .min(3, t('signup.errors.usernameMinMax'))
      .max(20, t('signup.errors.usernameMinMax'))
      .required(t('signup.errors.usernameRequired')),
    password: yup
      .string()
      .min(6, t('signup.errors.passwordMin'))
      .required(t('signup.errors.passwordRequired')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], t('signup.errors.passwordsMustMatch'))
      .required(t('signup.errors.confirmRequired')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError(null);
      
      try {
        await axios.post('/api/v1/signup', {
          username: values.username,
          password: values.password,
        });
        
        navigate('/login', { 
          state: { message: t('signup.success') }
        });
      } catch (err) {
        if (err.response?.status === 409) {
          setAuthError(t('signup.errors.userExists'));
        } else {
          setAuthError(t('signup.errors.network'));
        }
        console.error('Signup error:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4">{t('signup.title')}</h2>
              
              {authError && (
                <Alert variant="danger" className="mb-3">
                  {authError}
                </Alert>
              )}
              
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('signup.username')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.username && formik.errors.username}
                    disabled={formik.isSubmitting}
                    placeholder={t('signup.usernamePlaceholder')}
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('signup.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.password && formik.errors.password}
                    disabled={formik.isSubmitting}
                    placeholder={t('signup.passwordPlaceholder')}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>{t('signup.confirmPassword')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    disabled={formik.isSubmitting}
                    placeholder={t('signup.confirmPlaceholder')}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mb-3"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? t('signup.submitting') : t('signup.submit')}
                </Button>
                
                <div className="text-center">
                  <span className="text-muted">{t('signup.haveAccount')} </span>
                  <Link to="/login">{t('signup.login')}</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;