// frontend/src/components/MessageForm.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { addMessage } from '../slices/channelsSlice';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MessageForm = () => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentChannelId) return;

    setSending(true);
    setError(null);
    
    try {
      const response = await axios.post(
        '/api/v1/messages',
        {
          text: text.trim(),
          channelId: currentChannelId,
          username: user.username,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      
      // Добавляем сообщение в стор сразу после отправки
      dispatch(addMessage(response.data));
      setText('');
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
      
      if (err.response?.status === 401) {
        setError('Сессия истекла. Пожалуйста, войдите снова.');
      } else if (err.response?.status === 500) {
        setError('Ошибка сервера. Попробуйте позже.');
      } else {
        setError('Не удалось отправить сообщение. Проверьте соединение.');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-3 border-top">
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
              currentChannelId 
                ? "Введите сообщение..." 
                : "Сначала выберите канал"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending || !currentChannelId}
            aria-label="Сообщение"
          />
          <Button 
            type="submit" 
            variant="primary" 
            disabled={sending || !text.trim() || !currentChannelId}
          >
            {sending ? 'Отправка...' : 'Отправить'}
          </Button>
        </InputGroup>
        
        {/* Подсказка для пользователя */}
        {!currentChannelId && (
          <Form.Text className="text-muted mt-2 d-block">
            Выберите канал слева, чтобы начать общение
          </Form.Text>
        )}
      </Form>
    </div>
  );
};

export default MessageForm;