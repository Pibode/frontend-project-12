// frontend/src/pages/ChatPage.jsx
import { Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Добро пожаловать в чат!</h1>
            <Button variant="outline-danger" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
          <p>Вы успешно авторизовались! Здесь будет интерфейс чата.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;