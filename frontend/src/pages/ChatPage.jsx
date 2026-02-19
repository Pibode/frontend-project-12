// frontend/src/pages/ChatPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { fetchChannels, fetchMessages } from '../slices/channelsSlice';
import useSocket from '../hooks/useSocket';
import useChannelModals from '../hooks/useChannelModals';
import ChannelsList from '../components/ChannelsList';
import MessagesList from '../components/MessagesList';
import MessageForm from '../components/MessageForm';
import AddChannelModal from '../components/modals/AddChannelModal';
import RenameChannelModal from '../components/modals/RenameChannelModal';
import RemoveChannelModal from '../components/modals/RemoveChannelModal';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error, currentChannelId, channels } = useSelector(
    (state) => state.channels
  );

  useSocket();
  const { modalType } = useChannelModals();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchChannels()).unwrap(),
          dispatch(fetchMessages()).unwrap(),
        ]);
      } catch (err) {
        // Ошибка уже обработана в slice через toast
        console.error('Failed to load data:', err);
      }
    };

    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(t('chat.errors.loadData', { error }));
    }
  }, [error, t]);

  const currentChannel = channels.find(
    (ch) => Number(ch.id) === Number(currentChannelId)
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <ChannelsList />

        <div className="col-8 d-flex flex-column h-100 p-0">
          <div className="p-3 border-bottom">
            <h5 className="mb-0 text-truncate">
              {t('chat.currentChannel', { 
                channelName: currentChannel ? currentChannel.name : t('chat.noChannel') 
              })}
            </h5>
          </div>

          <MessagesList />
          <MessageForm />
        </div>
      </div>

      {modalType === 'adding' && <AddChannelModal />}
      {modalType === 'renaming' && <RenameChannelModal />}
      {modalType === 'removing' && <RemoveChannelModal />}
    </div>
  );
};

export default ChatPage;