// frontend/src/components/MessagesList.jsx
import { useSelector } from 'react-redux';
import { ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const MessagesList = () => {
  const { t } = useTranslation();
  const messages = useSelector((state) => state.channels.messages);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const channelMessages = messages.filter(
    (msg) => Number(msg.channelId) === Number(currentChannelId)
  );

  return (
    <div className="col-8 d-flex flex-column h-100">
      <div className="p-3 border-bottom">
        <h5 className="mb-0">{t('chat.messages')}</h5>
      </div>
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto p-3">
        {channelMessages.map((message) => (
          <ListGroup.Item key={message.id} className="border-0 px-0">
            <strong>{message.username}:</strong> {message.body || message.text}
          </ListGroup.Item>
        ))}
        {channelMessages.length === 0 && (
          <div className="text-muted text-center mt-3">
            {t('chat.noMessages')}
          </div>
        )}
      </ListGroup>
    </div>
  );
};

export default MessagesList;