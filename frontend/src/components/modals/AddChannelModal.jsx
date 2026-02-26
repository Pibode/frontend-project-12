// frontend/src/components/modals/AddChannelModal.jsx
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { addChannel } from '../../store/channelsSlice'
import useChannelModals from '../../hooks/useChannelModals'
import { cleanProfanity } from '../../utils/profanity'
import { getAddChannelValidationSchema } from '../../validation/channelValidation'

const AddChannelModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isOpen, handleCloseModal } = useChannelModals()
  const channels = useSelector(state => state.channels.channels)
  const inputRef = useRef(null)

  const validationSchema = getAddChannelValidationSchema(t, channels)

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const safeName = cleanProfanity(values.name)
      await dispatch(addChannel(safeName)).unwrap()
      resetForm()
      handleCloseModal()
    }
    catch (error) {
      console.error('Failed to add channel:', error)
      toast.error(error.message || t('modals.errors.unique'))
    }
    finally {
      setSubmitting(false)
    }
  }

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100)
    }
  }, [isOpen])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      formik.handleSubmit()
    }
  }

  return (
    <Modal show={isOpen} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.add.title')}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="modal-add-label">
            <Form.Label>{t('modals.add.label')}</Form.Label>
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
              placeholder={t('modals.add.placeholder')}
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t('modals.add.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? t('modals.add.submitting') : t('modals.add.submit')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AddChannelModal
