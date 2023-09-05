// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  error: null,
  isLoading: false,
  success: null,
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    setError: (state, action) => {
      state.success = null;
      state.error = action.payload;
      state.isLoading = false;
    },
    setSignUpLoading: (state) => {
      state.isLoading = true;
    },
    setSuccess: (state, action) => {
      state.error = null;
      state.success = action.payload;
      state.isLoading = false;

    },

  },
});

export const {
  setUser,
  setError,
  setSignUpLoading,
  setSuccess
} = signupSlice.actions;

export default signupSlice.reducer;
