import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SignUp from "@/components/authentication/SignUp";
import SignIn from "@/components/authentication/SignIn";
import { setError } from "@/store/authSlice/signupSlice";
import { useDispatch } from "react-redux";
import BgOne from '../../public/signup.jpg';
import BgTwo from '../../public/signin.jpg';
import Image from "next/image";

const AuthLayout = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [signUpFormData, setSignUpFormData] = useState({
    firstName: "",
    lastname: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [signInFormData, setSignInFormData] = useState({
    email: "",
    password: "",
  });
  const [signInError, setSignInError] = useState("");

  const handleToggleForm = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSignInFormData({
        email: "",
        password: "",
      });
      setSignInError("");
    } else {
      setSignUpFormData({
        firstName: "",
        lastname: "",
        email: "",
        password: "",
        repeatPassword: "",
      });
      dispatch(setError(null));
    }
  };

  return (
    <div className="bg-[#ffffff] w-full h-screen text-[#051010] text-[20px] flex items-center justify-center">
      <div className="w-full h-screen border z-[0] border-[#051010] relative bg-white">
        {/* Forms */}
        <motion.div
          animate={
            isOpen
              ? isMobile
                ? { y: "0%", zIndex: 2, opacity: 1 }
                : { x: "100%", zIndex: 2, opacity: 1 }
              : {}
          }
          transition={{ duration: 0.5 }}
          className="absolute top-0 opacity-100 left-0 bg-white h-full w-full md:w-1/2 z-[2] flex flex-col items-center justify-center gap-4"
        >
          <SignUp
            formData={signUpFormData}
            setFormData={setSignUpFormData}
            handleToggleForm={handleToggleForm}
          />
        </motion.div>
        <motion.div
          animate={
            isOpen
              ? isMobile
                ? { y: "0%", zIndex: 2, opacity: 1 }
                : { x: "100%", zIndex: 2, opacity: 1 }
              : {}
          }
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 z-[0] opacity-0 bg-white h-full w-full md:w-1/2 flex flex-col items-center justify-center gap-4"
        >
          <SignIn
            formData={signInFormData}
            setFormData={setSignInFormData}
            handleToggleForm={handleToggleForm}
          />
        </motion.div>

        {/*Overlays*/}
        <motion.div
          animate={isOpen ? { x: "-100%", zIndex: 2 } : {}}
          transition={{ duration: 0.5 }}
          className={`w-1/2 ${
            isMobile && "hidden"
          } h-full absolute z-[4] text-white right-0 bottom-0 md:top-0  md:flex flex-col items-center justify-center gap-4 overflow-hidden`}
        ><Image src={BgOne} alt='bgone' objectFit="cover" layout='fill'/></motion.div>
        <motion.div
          animate={isOpen ? { x: "-100%", zIndex: 3 } : {}}
          transition={{ duration: 0.5 }}
          className={`w-1/2 h-full ${
            isMobile && "hidden"
          } absolute z-[1]  right-0 bottom-0 md:top-0 md:flex flex-col items-center justify-center gap-4 overflow-hidden1`}
        >
        <Image src={BgTwo} alt='bgtwo' objectFit="cover"  layout='fill'/></motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
