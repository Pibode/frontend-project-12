// frontend/src/validation/signupValidation.js
import * as yup from 'yup'

export const getSignupValidationSchema = t => yup.object({
  username: yup
    .string()
    .min(3, t('signup.errors.usernameMinMax'))
    .max(20, t('signup.errors.usernameMinMax'))
    .required(t('signup.errors.usernameRequired')),
  password: yup
    .string()
    .min(6, t('signup.errors.passwordMin'))
    .required(t('signup.errors.passwordRequired')),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], t('signup.errors.passwordsMustMatch'))
    .required(t('signup.errors.confirmRequired')),
})

export default getSignupValidationSchema
