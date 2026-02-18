// frontend/src/pages/ChatPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { fetchChannels, fetchMessages } from '../slices/channelsSlice';
import ChannelsList from '../components/ChannelsList';
import MessagesList from '../components/MessagesList';
import MessageForm from '../components/MessageForm';

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { loading, error, currentChannelId, channels } = useSelector((state) => state.channels);

  useEffect(() => {
    Promise.all([
      dispatch(fetchChannels()),
      dispatch(fetchMessages()),
    ]);
  }, [dispatch]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentChannel = channels.find(ch => Number(ch.id) === Number(currentChannelId));

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Ошибка загрузки данных: {error}
        </div>
        <Button onClick={handleLogout}>Выйти и попробовать снова</Button>
      </div>
    );
  }

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <ChannelsList />
        
        <div className="col-8 d-flex flex-column h-100 p-0">
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Канал: #{currentChannel ? currentChannel.name : 'не выбран'}
            </h5>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
          
          <MessagesList />
          <MessageForm />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;