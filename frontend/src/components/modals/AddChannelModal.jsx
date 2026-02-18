// frontend/src/components/modals/AddChannelModal.jsx
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addChannel } from '../../slices/channelsSlice';
import { useAuth } from '../../contexts/AuthContext';
import useChannelModals from '../../hooks/useChannelModals';

const AddChannelModal = () => {
  const dispatch = useDispatch();
  const { isOpen, handleCloseModal } = useChannelModals();
  const { user } = useAuth();
  const channels = useSelector((state) => state.channels.channels);
  const inputRef = useRef(null);

  // Схема валидации
  const validationSchema = yup.object({
    name: yup
      .string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле')
      .test('unique', 'Канал с таким именем уже существует', (value) => {
        return !channels.some((ch) => ch.name === value);
      }),
  });

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await dispatch(addChannel(values.name)).unwrap();
        resetForm();
        handleCloseModal();
      } catch (error) {
        console.error('Failed to add channel:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Устанавливаем фокус при открытии
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Обработчик нажатия Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formik.handleSubmit();
    }
  };

  return (
    <Modal show={isOpen} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Имя канала</Form.Label>
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
              placeholder="Например: general"
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
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? 'Создание...' : 'Создать канал'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddChannelModal;