
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: null,
  isLoading: false,
  success: null,
};

const ForgotPasswordSlice = createSlice({
  name: 'forgot-password',
  initialState,
  reducers: {
    setForgotError: (state, action) => {
      state.success = null;
      state.error = action.payload;
      state.isLoading = false;
    },
    setForgotLoading: (state) => {
      state.isLoading = true;
    },
    setForgotSuccess: (state, action) => {
      state.error = null;
      state.success = action.payload;
      state.isLoading = false;

    },
    clearForgotPasswordState: (state) => {
        state.error = null;
        state.success = null;
      },
  },
});

export const {
  setForgotError,
  setForgotLoading,
  setForgotSuccess,
  clearForgotPasswordState
} = ForgotPasswordSlice.actions;

export default ForgotPasswordSlice.reducer;
