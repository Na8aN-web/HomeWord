import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
};

const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setLoginError: (state, action) => {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoginLoading: (state) => {
      state.isLoading = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setLogin, setLoginError, setLoginLoading, clearUser } = loginSlice.actions;
export default loginSlice.reducer;
