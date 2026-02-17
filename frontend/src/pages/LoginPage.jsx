// frontend/src/pages/LoginPage.jsx
import { useFormik } from 'formik';

const LoginPage = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
   
      console.log('Form values:', values);
    },
  });

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Войти</h2>
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
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Войти
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;