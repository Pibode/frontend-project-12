// frontend/src/components/ChannelMenu.jsx
import { Dropdown } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import useChannelModals from '../hooks/useChannelModals';

const ChannelMenu = ({ channel }) => {
  const { t } = useTranslation();
  const { handleOpenRenameModal, handleOpenRemoveModal } = useChannelModals();

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
        as="span"
        variant="link"
        className="text-muted p-0 border-0"
        style={{ textDecoration: 'none', cursor: 'pointer' }}
        aria-label={t('modals.management') || 'Управление каналом'}
      >
        <ThreeDotsVertical size={16} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={handleRename}>
          {t('modals.rename.submit')}
        </Dropdown.Item>
        <Dropdown.Item onClick={handleRemove} className="text-danger">
          {t('modals.remove.submit')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChannelMenu;