// frontend/src/components/modals/RenameChannelModal.jsx
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { renameChannel } from '../../store/channelsSlice'
import useChannelModals from '../../hooks/useChannelModals'
import { cleanProfanity } from '../../utils/profanity'
import { getRenameChannelValidationSchema } from '../../validation/channelValidation'

const RenameChannelModal = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isOpen, channelId, handleCloseModal } = useChannelModals()
  const channels = useSelector(state => state.channels.channels)
  const inputRef = useRef(null)

  const currentChannel = channels.find(ch => ch.id === channelId)

  const validationSchema = getRenameChannelValidationSchema(t, channels, channelId)

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const safeName = cleanProfanity(values.name)
      await dispatch(renameChannel({ id: channelId, name: safeName })).unwrap()
      handleCloseModal()
    }
    catch (error) {
      console.error('Failed to rename channel:', error)
      toast.error(error.message || t('modals.errors.unique'))
    }
    finally {
      setSubmitting(false)
    }
  }

  const formik = useFormik({
    initialValues: { name: currentChannel?.name || '' },
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
        inputRef.current.select()
      }, 100)
    }
  }, [isOpen])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      formik.handleSubmit()
    }
  }

  if (!currentChannel) return null

  return (
    <Modal show={isOpen} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.rename.title')}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="modal-rename-label">
            <Form.Label>{t('modals.rename.label')}</Form.Label>
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
            <label className="visually-hidden" htmlFor="name">Имя канала</label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t('modals.rename.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={formik.isSubmitting || !formik.isValid || formik.values.name === currentChannel.name}
          >
            {formik.isSubmitting ? t('modals.rename.submitting') : t('modals.rename.submit')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default RenameChannelModal
