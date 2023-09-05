import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/authSlice/authActions";
import AnimatedPlaceholderInput from "../AnimatedPlaceholder";
import { useRouter } from "next/router";

import Link from "next/link";

const SignIn = ({ formData, setFormData, handleToggleForm }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.login.error);
  const authLoading = useSelector((state) => state.login.isLoading);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  const handleSignIn = async (e) => {
    e.preventDefault();
    dispatch(login(formData.email, formData.password));
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard/Home");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className=" h-screen w-full overflow-y-scroll custom-scrollbar">
      <form className="formimg2 flex flex-col items-center justify-center h-screen">
        <h1 className="sm:text-4xl text-xl font-bold font-mont my-8">
          <span className="bg-white md:bg-gradient-to-r from-[#5dc5cb] to-[#6568c9]  text-transparent bg-clip-text">
            Welcome Back
          </span>
        </h1>
        <div className="w-[80%]">
          <AnimatedPlaceholderInput
            type="email"
            label="Email Address"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            color="#6568c9"
          />
          <AnimatedPlaceholderInput
            type="password"
            label="Password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            color="#6568c9"
          />
        </div>
        {authError && (
          <div className="text-white text-[13px] font-mont border-2 border-[#5dc5cb] p-2 my-2 bg-red-500">
            {authError}
          </div>
        )}
        <div className="flex w-full justify-center">
          <button
            type="submit"
            className="bg-[#6568c9] hover:bg-white hover:text-[#6568c9] border-2 text-[15px] hover:border-[#6568c9] text-white px-24 py-3 rounded-lg mt-6 font-mont"
            disabled={authLoading}
            onClick={handleSignIn}
          >
            {authLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
        <h5 className="md:text-black text-white flex justify-center text-[15px] items-center font-mont p-2">
          Don't have an account?{" "}
          <div className="">
            <h4
              onClick={handleToggleForm}
              className="text-white md:text-[#6568c9] underline hover:cursor-pointer"
            >
              Sign Up
            </h4>
          </div>
        </h5>
        <Link
          href="/authentication/ForgotPassword"
          className="text-white md:text-[#6568c9] text-[16px] underline hover:cursor-pointer font-mont"
        >
          Forgot Password?
        </Link>
      </form>
    </div>
  );
};

export default SignIn;
