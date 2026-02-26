// frontend/src/components/ChannelMenu.jsx
import { Dropdown } from 'react-bootstrap'
import { ThreeDotsVertical } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import useChannelModals from '../hooks/useChannelModals'

const ChannelMenu = ({ channel }) => {
  const { t } = useTranslation()
  const { handleOpenRenameModal, handleOpenRemoveModal } = useChannelModals()

  if (channel.name === 'general' || !channel.removable) {
    return null
  }

  const handleRename = (e) => {
    e.stopPropagation()
    handleOpenRenameModal(channel.id)
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    handleOpenRemoveModal(channel.id)
  }

  return (
    <Dropdown
      onClick={e => e.stopPropagation()}
      className="channel-menu-dropdown"
    >
      <Dropdown.Toggle
        as="button"
        type="button"
        variant="light"
        className="channel-menu-toggle p-0 border-0 bg-transparent d-flex align-items-center justify-content-center"
      >
        <ThreeDotsVertical size={16} />
        <span className="visually-hidden">
          {t('modals.add.management')}
        </span>
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
  )
}

export default ChannelMenu
