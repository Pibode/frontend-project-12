// frontend/src/components/ChannelsList.jsx
import { useDispatch, useSelector } from 'react-redux';
import { Button, ListGroup, Badge } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import { setCurrentChannel } from '../slices/channelsSlice';
import ChannelMenu from './ChannelMenu';
import useChannelModals from '../hooks/useChannelModals';

const ChannelsList = () => {
  const dispatch = useDispatch();
  const { handleOpenAddModal } = useChannelModals();
  const channels = useSelector((state) => state.channels.channels);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const messages = useSelector((state) => state.channels.messages);

  const getMessagesCount = (channelId) => {
    return messages.filter((msg) => Number(msg.channelId) === Number(channelId)).length;
  };

  const truncateName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    return `${name.slice(0, maxLength)}...`;
  };

  return (
    <div className="col-4 border-end vh-100 p-0 d-flex flex-column">
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Каналы</h5>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleOpenAddModal}
          title="Создать новый канал"
          aria-label="Добавить канал"
        >
          <Plus size={16} />
        </Button>
      </div>

      <div className="overflow-auto flex-grow-1">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            className={`w-100 d-flex justify-content-between align-items-center p-3 border-0 text-start ${
              Number(currentChannelId) === Number(channel.id)
                ? 'bg-light'
                : 'bg-white'
            }`}
            style={{ cursor: 'pointer' }}
            aria-pressed={Number(currentChannelId) === Number(channel.id)}
            aria-label={channel.name}
          >
            <div className="d-flex align-items-center overflow-hidden flex-grow-1">
              <span className="text-truncate" style={{ maxWidth: '150px' }}>
                # {truncateName(channel.name)}
              </span>
              <Badge bg="secondary" pill className="ms-2">
                {getMessagesCount(channel.id)}
              </Badge>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <ChannelMenu channel={channel} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChannelsList;