// frontend/src/components/MessageForm.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { addMessage } from '../slices/channelsSlice';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MessageForm = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

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
          timeout: 10000,
        }
      );

      dispatch(addMessage(response.data));
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
      setText(messageText);

      if (err.code === 'ECONNABORTED') {
        setError(t('chat.errors.messageTimeout'));
      } else if (err.response?.status === 401) {
        setError(t('chat.errors.sessionExpired'));
      } else if (err.response?.status === 500) {
        setError(t('chat.errors.serverError'));
      } else if (!isOnline) {
        setError(t('chat.errors.connection'));
      } else {
        setError(t('chat.errors.connection'));
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-3 border-top">
      {!isOnline && (
        <Alert variant="warning" className="mb-3 py-2">
          <small>⚠️ {t('chat.offline')}</small>
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
                ? t('chat.offline')
                : currentChannelId
                ? t('chat.messagePlaceholder')
                : t('chat.chooseChannel')
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
                {t('chat.sending')}
              </>
            ) : (
              t('chat.send')
            )}
          </Button>
        </InputGroup>

        {!currentChannelId && isOnline && (
          <Form.Text className="text-muted mt-2 d-block">
            {t('chat.chooseChannel')}
          </Form.Text>
        )}
      </Form>
    </div>
  );
};

export default MessageForm;