// frontend/src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container text-center mt-5">
      <h1 className="display-1">{t('notFound.title')}</h1>
      <h2 className="mb-4">{t('notFound.header')}</h2>
      <p className="mb-4">
        {t('notFound.message')}
      </p>
      <Link to="/" className="btn btn-primary">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
};

export default NotFoundPage;