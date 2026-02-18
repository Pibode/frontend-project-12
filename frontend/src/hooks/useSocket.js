import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import socketService from '../services/socket';
import { addMessage, addChannel, renameChannel, removeChannel } from '../slices/channelsSlice';

const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Подписываемся на новые сообщения
    socketService.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    // Подписываемся на новые каналы
    socketService.on('newChannel', (channel) => {
      dispatch(addChannel(channel));
    });

    // Подписываемся на переименование каналов
    socketService.on('renameChannel', (channel) => {
      dispatch(renameChannel({ id: channel.id, name: channel.name }));
    });

    // Подписываемся на удаление каналов
    socketService.on('removeChannel', ({ id }) => {
      dispatch(removeChannel(id));
    });

    // Очищаем подписки при размонтировании
    return () => {
      socketService.off('newMessage');
      socketService.off('newChannel');
      socketService.off('renameChannel');
      socketService.off('removeChannel');
    };
  }, [dispatch]);
};

export default useSocket;