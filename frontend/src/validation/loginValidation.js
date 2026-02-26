// frontend/src/validation/loginValidation.js
import * as yup from 'yup'

export const getLoginValidationSchema = t => yup.object({
  username: yup
    .string()
    .trim()
    .required(t('login.errors.usernameRequired')),
  password: yup
    .string()
    .required(t('login.errors.passwordRequired')),
})

export default getLoginValidationSchema
