// frontend/src/validation/channelValidation.js
import * as yup from 'yup'

export const getAddChannelValidationSchema = (t, channels) => yup.object({
  name: yup
    .string()
    .min(3, t('modals.errors.minMax'))
    .max(20, t('modals.errors.minMax'))
    .required(t('modals.errors.required'))
    .test('unique', t('modals.errors.unique'), value => !channels.some(ch => ch.name === value)),
})

export const getRenameChannelValidationSchema = (t, channels, channelId) => yup.object({
  name: yup
    .string()
    .min(3, t('modals.errors.minMax'))
    .max(20, t('modals.errors.minMax'))
    .required(t('modals.errors.required'))
    .test(
      'unique',
      t('modals.errors.unique'),
      value => !channels.some(ch => ch.name === value && ch.id !== channelId),
    ),
})
