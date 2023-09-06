import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { auth } from "../../firebase";
import { setUser, setError, setSignUpLoading, setSuccess } from "./signupSlice";
import {
  setLogin,
  setLoginError,
  setLoginLoading,
  clearUser
} from "./loginSlice";
import {
  setForgotError,
  setForgotLoading,
  setForgotSuccess,
} from "./ForgotPasswordSlice";

export const signup = (email, password) => async (dispatch) => {
  dispatch(setSignUpLoading());
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    dispatch(
      setUser({
        email: user.email,
        uid: user.uid,
      })
    );

    dispatch(setSuccess("Your account has been created successfully"));
  } catch (err) {
    dispatch(setError(err.code));
  }
};

// Auth actions
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
      })
    );
  } catch (err) {
    dispatch(setLoginError(err.code));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(clearUser()); // Dispatch the logout action
  } catch (error) {
    
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(setForgotLoading());
  try {
    // Send a password reset email to the user's email address
    await sendPasswordResetEmail(auth, email);

    // You can dispatch a success message to inform the user that the reset email has been sent
    dispatch(setForgotSuccess("Password reset email sent successfully"));
  } catch (err) {
    // Handle errors here, e.g., dispatch an error message
    dispatch(setForgotError(err.message));
  }
};
