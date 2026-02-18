// frontend/src/components/ChannelMenu.jsx
import { Dropdown } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import useChannelModals from '../hooks/useChannelModals';

const ChannelMenu = ({ channel }) => {
  const { handleOpenRenameModal, handleOpenRemoveModal } = useChannelModals();

  // Нельзя удалить/переименовать general
  if (channel.name === 'general' || !channel.removable) {
    return null;
  }

  const handleRename = (e) => {
    e.stopPropagation();
    handleOpenRenameModal(channel.id);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    handleOpenRemoveModal(channel.id);
  };

  return (
    <Dropdown onClick={(e) => e.stopPropagation()}>
      <Dropdown.Toggle 
        variant="link" 
        className="text-muted p-0 border-0"
        style={{ textDecoration: 'none' }}
      >
        <ThreeDotsVertical size={16} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={handleRename}>
          Переименовать
        </Dropdown.Item>
        <Dropdown.Item onClick={handleRemove} className="text-danger">
          Удалить
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChannelMenu;