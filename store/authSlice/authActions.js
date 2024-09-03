import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
  getAuth,
  updateProfile
} from "firebase/auth";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from "../../firebase";
import { setUser, setError, setSignUpLoading, setSuccess } from "./signupSlice";
import {
  setLogin,
  setLoginError,
  setLoginLoading,
  clearUser,
} from "./loginSlice";
import {
  setForgotError,
  setForgotLoading,
  setForgotSuccess,
} from "./ForgotPasswordSlice";

export const signup = (email, password, firstName, lastname) => async (dispatch) => {
  dispatch(setSignUpLoading());
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, {
      displayName: `${firstName} ${lastname}`,
    });
    const user = userCredential.user;

    dispatch(
      setUser({
        email: user.email,
        uid: user.uid,
        displayName: user.displayName
      })
    );

    dispatch(setSuccess("Your account has been created successfully"));
    console.log(user)
  } catch (err) {
    dispatch(setError(err.code));
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch(setLoginLoading());
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    dispatch(
      setLogin({
        email: user.email,
        uid: user.uid,
        displayName: user.displayName
      })
    );
  } catch (err) {
    dispatch(setLoginError(err.code));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(clearUser()); 
  } catch (error) {}
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(setForgotLoading());
  try {
    await sendPasswordResetEmail(auth, email);
    dispatch(setForgotSuccess("Password reset email sent successfully"));
  } catch (err) {
    dispatch(setForgotError(err.message));
  }
};


export const deleteUserAccount = createAsyncThunk(
  'auth/deleteUserAccount',
  async (_, { rejectWithValue }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return rejectWithValue('No user is currently logged in.');
    }

    try {
      await deleteUser(user);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);