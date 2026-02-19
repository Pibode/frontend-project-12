// frontend/src/pages/SignupPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);

  const validationSchema = yup.object({
    username: yup
      .string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: yup
      .string()
      .min(6, 'Не менее 6 символов')
      .required('Обязательное поле'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
      .required('Обязательное поле'),
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
        
        // После успешной регистрации перенаправляем на страницу входа
        // (пользователь должен войти с новыми данными)
        navigate('/login', { 
          state: { message: 'Регистрация прошла успешно! Теперь можно войти.' }
        });
      } catch (err) {
        if (err.response?.status === 409) {
          setAuthError('Пользователь с таким именем уже существует');
        } else {
          setAuthError('Ошибка сети. Попробуйте позже.');
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
              <h2 className="text-center mb-4">Регистрация</h2>
              
              {authError && (
                <Alert variant="danger" className="mb-3">
                  {authError}
                </Alert>
              )}
              
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Имя пользователя</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.username && formik.errors.username}
                    disabled={formik.isSubmitting}
                    placeholder="От 3 до 20 символов"
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.password && formik.errors.password}
                    disabled={formik.isSubmitting}
                    placeholder="Не менее 6 символов"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Подтвердите пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    disabled={formik.isSubmitting}
                    placeholder="Повторите пароль"
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
                  {formik.isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
                
                <div className="text-center">
                  <span className="text-muted">Уже есть аккаунт? </span>
                  <Link to="/login">Войти</Link>
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