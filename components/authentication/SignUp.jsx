import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnimatedPlaceholderInput from "../AnimatedPlaceholder";
import { signup } from "@/store/authSlice/authActions";
import { setError } from "@/store/authSlice/signupSlice";
import Image from "next/image";
import BGone from '../../public/signup.jpg'

const SignUp = ({ formData, setFormData, handleToggleForm }) => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.signup.error);
  const success = useSelector((state) => state.signup.success);
  const isSignUpLoading = useSelector((state) => state.signup.isLoading);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password === formData.repeatPassword) {
      dispatch(signup(formData.email, formData.password));
    } else {
      dispatch(setError("Passwords don't match"));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log(success);

  return (
    <div className=" h-screen w-full overflow-y-scroll custom-scrollbar relative ">
      <Image
        src={BGone}
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        className="block md:hidden"
      />
      <form
        onSubmit={handleSignUp}
        className=" flex flex-col items-center justify-center h-screen overlay"
      >
        <h1 className="sm:text-4xl text-xl font-semibold font-mont text-center">
          <span className="bg-white md:bg-gradient-to-r from-[#5934ae] to-[#5dc5cb] text-transparent bg-clip-text">
            CREATE AN ACCOUNT
          </span>
        </h1>
        <h6 className="text-white md:text-gray-800  font-mont font-light sm:text-base text-sm w-[350px] text-center p-8">
          Create an account and start studying the word of God!
        </h6>
        <div className="w-[80%]">
          <AnimatedPlaceholderInput
            type="text"
            label="First name"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            color="#5dc5cb"
          />
          <AnimatedPlaceholderInput
            type="text"
            label="Last name"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            required
            color="#5dc5cb"
          />
          <AnimatedPlaceholderInput
            type="email"
            label="Email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            color="#5dc5cb"
          />
          <AnimatedPlaceholderInput
            type="password"
            label="Password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            color="#5dc5cb"
          />
          <AnimatedPlaceholderInput
            type="password"
            label="Repeat Password"
            id="repeatPassword"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleInputChange}
            required
            color="#5dc5cb"
          />
        </div>
        {error && (
          <div className="text-white text-[13px] font-mont border-2 border-[#5dc5cb] p-2 my-2 bg-red-500">
            {error}
          </div>
        )}
        {success && (
          <div className="text-white text-[13px] font-mont border-2 border-[#5dc5cb] p-2 my-2 bg-gray-800">
            {success}{" "}
            <span
              onClick={handleToggleForm}
              className="text-[#5dc5cb] underline"
            >
              Log In
            </span>
          </div>
        )}
        <div className="flex w-full justify-center">
          <button
            type="submit"
            className="bg-[#5dc5cb] hover:bg-white hover:text-[#5dc5cb] border-2 text-[15px] hover:border-[#5dc5cb] text-white px-24 py-3 rounded-lg mt-6 font-mont"
          >
            {isSignUpLoading ? "Loading..." : "Sign Up"}
          </button>
        </div>
        <h5 className="md:text-black text-white flex justify-center text-[15px] items-center font-mont p-2">
          Already have an account?{" "}
          <div className="">
            <h4
              onClick={handleToggleForm}
              className="text-white md:text-[#5dc5cb] underline hover:cursor-pointer"
            >
              Sign In
            </h4>
          </div>
        </h5>
      </form>
    </div>
  );
};

export default SignUp;
