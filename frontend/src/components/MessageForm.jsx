// frontend/src/components/MessageForm.jsx
import { useState, useEffect } from 'react'; // <-- Добавляем useEffect
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap'; // <-- Добавляем Spinner
import { addMessage } from '../slices/channelsSlice';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MessageForm = () => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // <-- Отслеживаем статус сети
  const dispatch = useDispatch();
  const { user } = useAuth();
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  // Следим за изменением статуса сети
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentChannelId || !isOnline) return;

    const messageText = text.trim();
    // Оптимистично очищаем поле сразу
    setText('');
    setSending(true);
    setError(null);
    
    try {
      const response = await axios.post(
        '/api/v1/messages',
        {
          text: messageText,
          channelId: currentChannelId,
          username: user.username,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 10000, // Таймаут 10 секунд
        }
      );
      
      // Сообщение уже добавится через сокет, но для надежности добавим и здесь
      dispatch(addMessage(response.data));
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
      
      // Возвращаем текст обратно в поле при ошибке
      setText(messageText);
      
      if (err.code === 'ECONNABORTED') {
        setError('Сервер не отвечает. Попробуйте позже.');
      } else if (err.response?.status === 401) {
        setError('Сессия истекла. Пожалуйста, войдите снова.');
      } else if (err.response?.status === 500) {
        setError('Ошибка сервера. Попробуйте позже.');
      } else if (!isOnline) {
        setError('Нет подключения к интернету.');
      } else {
        setError('Не удалось отправить сообщение. Проверьте соединение.');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-3 border-top">
      {/* Индикатор офлайн-режима */}
      {!isOnline && (
        <Alert variant="warning" className="mb-3 py-2">
          <small>⚠️ Нет подключения к интернету. Сообщения не будут отправлены.</small>
        </Alert>
      )}
      
      {error && (
        <Alert 
          variant="danger" 
          className="mb-3 py-2"
          dismissible
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder={
              !isOnline
                ? "Нет подключения к интернету..."
                : currentChannelId 
                ? "Введите сообщение..." 
                : "Сначала выберите канал"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending || !currentChannelId || !isOnline}
            aria-label="Сообщение"
          />
          <Button 
            type="submit" 
            variant="primary" 
            disabled={sending || !text.trim() || !currentChannelId || !isOnline}
          >
            {sending ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Отправка...
              </>
            ) : (
              'Отправить'
            )}
          </Button>
        </InputGroup>
        
        {/* Подсказки для пользователя */}
        {!currentChannelId && isOnline && (
          <Form.Text className="text-muted mt-2 d-block">
            Выберите канал слева, чтобы начать общение
          </Form.Text>
        )}
      </Form>
    </div>
  );
};

export default MessageForm;