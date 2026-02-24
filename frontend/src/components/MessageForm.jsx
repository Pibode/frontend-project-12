// frontend/src/components/MessageForm.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addMessage } from '../slices/channelsSlice';
import { useAuth } from '../contexts/AuthContext';
import { containsProfanity, cleanProfanity } from '../utils/profanity';
import axios from 'axios';

const MessageForm = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('🔄 ' + t('chat.online'), { autoClose: 2000 });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('📡 ' + t('chat.offline'), { autoClose: 5000 });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentChannelId || !isOnline) return;

    // Очищаем текст от нецензурных слов
    const rawText = text.trim();
    const cleanText = cleanProfanity(rawText);

    // Проверяем, были ли замены
    const wasProfane = rawText !== cleanText;

    setText('');
    setSending(true);

    try {
      const response = await axios.post(
        '/api/v1/messages',
        {
          text: cleanText, // Отправляем очищенный текст
          channelId: currentChannelId,
          username: user.username,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 10000,
        }
      );

      dispatch(addMessage(response.data));

      // Если были замены, показываем уведомление
      if (wasProfane) {
        toast.info(t('chat.profanityFiltered'), {
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
      setText(rawText); // Возвращаем оригинальный текст при ошибке

      if (err.code === 'ECONNABORTED') {
        toast.error(t('chat.errors.messageTimeout'));
      } else if (err.response?.status === 401) {
        toast.error(t('chat.errors.sessionExpired'));
      } else if (err.response?.status === 500) {
        toast.error(t('chat.errors.serverError'));
      } else if (!isOnline) {
        toast.error(t('chat.errors.connection'));
      } else {
        toast.error(t('chat.errors.connection'));
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-3 border-top">
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
            aria-label="Новое сообщение"
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
