// frontend/src/components/ChannelsList.jsx
import { useDispatch, useSelector } from 'react-redux'
import { Button, Badge } from 'react-bootstrap'
import { Plus } from 'react-bootstrap-icons'
import { setCurrentChannel } from '../store/channelsSlice'
import ChannelMenu from './ChannelMenu'
import useChannelModals from '../hooks/useChannelModals'

const ChannelsList = () => {
  const dispatch = useDispatch()
  const { handleOpenAddModal } = useChannelModals()
  const channels = useSelector(state => state.channels.channels) || []
  const currentChannelId = useSelector(state => state.channels.currentChannelId)
  const messages = useSelector(state => state.channels.messages) || []

  const getMessagesCount = (channelId) => {
    return messages.filter(msg => Number(msg.channelId) === Number(channelId)).length
  }

  const truncateName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name
    return `${name.slice(0, maxLength)}...`
  }

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex" data-testid="channels-list">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <h5 className="mb-0">Каналы</h5>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleOpenAddModal}
          title="Создать новый канал"
          aria-label="Добавить канал"
        >
          <Plus size={16} />
          <span className="visually-hidden">+</span>
        </Button>
      </div>

      <div className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels && Array.isArray(channels) && channels.length > 0
          ? (
              channels.map(channel => (
                <button
                  type="button"
                  key={channel.id}
                  onClick={() => dispatch(setCurrentChannel(channel.id))}
                  className={`w-100 d-flex justify-content-between align-items-center p-3 border-0 text-start ${
                    Number(currentChannelId) === Number(channel.id)
                      ? 'bg-light text-primary'
                      : 'bg-white text-dark'
                  }`}
                  style={{
                    cursor: 'pointer',
                    borderBottom: '1px solid #dee2e6',
                    transition: 'background-color 0.2s',
                    display: 'block',
                  }}
                  aria-pressed={Number(currentChannelId) === Number(channel.id)}
                  aria-label={channel.name}
                  data-testid={`channel-btn-${channel.name}`}
                >
                  <div className="d-flex align-items-center overflow-hidden flex-grow-1">
                    <span className="text-truncate" style={{ maxWidth: '150px' }}>
                      #
                      {' '}
                      {truncateName(channel.name)}
                    </span>
                    <Badge bg="secondary" pill className="ms-2">
                      {getMessagesCount(channel.id)}
                    </Badge>
                  </div>
                  <div onClick={e => e.stopPropagation()}>
                    <ChannelMenu channel={channel} />
                  </div>
                </button>
              ))
            )
          : (
              <div className="p-3 text-muted text-center">
                Каналы загружаются...
              </div>
            )}
      </div>
    </div>
  )
}

export default ChannelsList
