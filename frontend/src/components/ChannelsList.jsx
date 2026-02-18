// frontend/src/components/ChannelsList.jsx
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChannel } from '../slices/channelsSlice';
import { ListGroup, Badge } from 'react-bootstrap';

const ChannelsList = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const messages = useSelector((state) => state.channels.messages);

  const getMessagesCount = (channelId) => {
    return messages.filter((msg) => Number(msg.channelId) === Number(channelId)).length;
  };

  return (
    <div className="col-4 border-end vh-100 p-0">
      <div className="p-3 border-bottom">
        <h5 className="mb-0">Каналы</h5>
      </div>
      <ListGroup variant="flush" className="overflow-auto h-100">
        {channels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            action
            active={Number(currentChannelId) === Number(channel.id)}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            className="d-flex justify-content-between align-items-center"
          >
            <span># {channel.name}</span>
            <Badge bg="secondary" pill>
              {getMessagesCount(channel.id)}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ChannelsList;