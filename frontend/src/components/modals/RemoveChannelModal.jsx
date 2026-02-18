// frontend/src/components/modals/RemoveChannelModal.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { removeChannel } from '../../slices/channelsSlice';
import useChannelModals from '../../hooks/useChannelModals';

const RemoveChannelModal = () => {
  const dispatch = useDispatch();
  const [removing, setRemoving] = useState(false);
  const { isOpen, channelId, handleCloseModal } = useChannelModals();
  const channels = useSelector((state) => state.channels.channels);

  const currentChannel = channels.find((ch) => ch.id === channelId);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await dispatch(removeChannel(channelId)).unwrap();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to remove channel:', error);
    } finally {
      setRemoving(false);
    }
  };

  if (!currentChannel) return null;

  return (
    <Modal show={isOpen} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p>Вы уверены, что хотите удалить канал <strong># {currentChannel.name}</strong>?</p>
        <p className="text-muted small">Все сообщения в этом канале будут безвозвратно удалены.</p>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal} disabled={removing}>
          Отмена
        </Button>
        <Button 
          variant="danger" 
          onClick={handleRemove} 
          disabled={removing}
        >
          {removing ? 'Удаление...' : 'Удалить канал'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;