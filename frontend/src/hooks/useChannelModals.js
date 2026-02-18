// frontend/src/hooks/useChannelModals.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../slices/channelsSlice';

const useChannelModals = () => {
  const dispatch = useDispatch();
  const { modals } = useSelector((state) => state.channels);

  const handleOpenAddModal = useCallback(() => {
    dispatch(openModal({ type: 'adding' }));
  }, [dispatch]);

  const handleOpenRenameModal = useCallback((channelId) => {
    dispatch(openModal({ type: 'renaming', channelId }));
  }, [dispatch]);

  const handleOpenRemoveModal = useCallback((channelId) => {
    dispatch(openModal({ type: 'removing', channelId }));
  }, [dispatch]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return {
    isOpen: modals.isOpen,
    modalType: modals.type,
    channelId: modals.channelId,
    handleOpenAddModal,
    handleOpenRenameModal,
    handleOpenRemoveModal,
    handleCloseModal,
  };
};

export default useChannelModals;