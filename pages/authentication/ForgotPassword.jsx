import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../store/authSlice/authActions";
import AnimatedPlaceholderInput from "../../components/AnimatedPlaceholder";
import Link from "next/link";
import { clearForgotPasswordState } from "@/store/authSlice/ForgotPasswordSlice";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const forgotError = useSelector((state) => state.forgotPassword.error); // Get the error state from the auth slice
  const forgotSuccess = useSelector((state) => state.forgotPassword.success); // Get the success state from the auth slice
  const forgotLoading = useSelector((state) => state.forgotPassword.isLoading);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    dispatch(clearForgotPasswordState());
  }, [dispatch]);
  return (
    <div className=" h-screen w-full flex flex-row overflow-y-scroll custom-scrollbar">
      <form
        className="formimg3 flex flex-col items-center justify-center w-full md:w-1/2 h-screen"
        onSubmit={handleForgotPassword}
      >
        <h1 className="sm:text-4xl text-xl font-bold font-mont my-8">
          <span className="bg-white md:bg-gradient-to-r from-[#f9aaab] to-[#face72]  text-transparent bg-clip-text">
            Forgot Password?
          </span>
        </h1>
        <div className="w-[80%]">
          <AnimatedPlaceholderInput
            type="email"
            label="Email Address"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            color="#f9aaab"
          />
        </div>
        {forgotError && (
          <div className="text-white text-[13px] font-mont border-2 border-[#f9aaab] p-2 my-2 bg-red-500">
            {forgotError}
          </div>
        )}
        {forgotSuccess && (
          <div className="text-white text-[13px] font-mont border-2 border-[#f9aaab] p-2 my-2 bg-gray-800">
            {forgotSuccess}{" "}
            <Link
              href="/authentication/AuthLayout"
              className="text-[#f9aaab] underline"
            >
              Log In
            </Link>
          </div>
        )}
        <div className="flex w-full justify-center">
          <button
            type="submit"
            className="bg-[#f9aaab] hover:bg-white hover:text-[#f9aaab] border-2 text-[15px] hover:border-[#f9aaab] text-white px-24 py-3 rounded-lg mt-6 font-mont"
            disabled={forgotLoading}
          >
            {forgotLoading ? "Loading..." : "Reset"}
          </button>
        </div>
      </form>
      <div className="w-1/2 testimg3 hidden md:block"></div>
    </div>
  );
}

export default ForgotPassword;
