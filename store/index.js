import { configureStore } from '@reduxjs/toolkit'
import signupReducer from './authSlice/signupSlice'
import loginReducer from './authSlice/loginSlice'
import ForgotPasswordReducer from './authSlice/ForgotPasswordSlice'

const store = configureStore({
  reducer: {
    signup: signupReducer,
    login: loginReducer,
    forgotPassword: ForgotPasswordReducer,
  },
})

export default store
