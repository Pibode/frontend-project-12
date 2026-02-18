// frontend/src/components/modals/RenameChannelModal.jsx
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { renameChannel } from '../../slices/channelsSlice';
import useChannelModals from '../../hooks/useChannelModals';

const RenameChannelModal = () => {
  const dispatch = useDispatch();
  const { isOpen, channelId, handleCloseModal } = useChannelModals();
  const channels = useSelector((state) => state.channels.channels);
  const inputRef = useRef(null);

  const currentChannel = channels.find((ch) => ch.id === channelId);

  // Схема валидации
  const validationSchema = yup.object({
    name: yup
      .string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .test('unique', 'Канал с таким именем уже существует', (value) => {
        return !channels.some(
          (ch) => ch.name === value && ch.id !== channelId
        );
      }),
  });

  const formik = useFormik({
    initialValues: { name: currentChannel?.name || '' },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(renameChannel({ id: channelId, name: values.name })).unwrap();
        handleCloseModal();
      } catch (error) {
        console.error('Failed to rename channel:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Устанавливаем фокус при открытии
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
        inputRef.current.select();
      }, 100);
    }
  }, [isOpen]);

  // Обработчик нажатия Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formik.handleSubmit();
    }
  };

  if (!currentChannel) return null;

  return (
    <Modal show={isOpen} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Новое имя канала</Form.Label>
            <Form.Control
              ref={inputRef}
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={handleKeyDown}
              isInvalid={formik.touched.name && formik.errors.name}
              disabled={formik.isSubmitting}
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Отмена
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={formik.isSubmitting || !formik.isValid || formik.values.name === currentChannel.name}
          >
            {formik.isSubmitting ? 'Сохранение...' : 'Переименовать'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RenameChannelModal;