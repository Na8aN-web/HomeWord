import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import HeroImg from "../public/hero2.jpg";
import { FiLogIn } from "react-icons/fi";
import Link from "next/link";
import Typed from "typed.js";

const Hero = () => {
  const el = useRef(null);
  const typed = useRef(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const options = {
      strings: ["Explore", "Reflect", "be Inspired", "Discover", "Learn"],
      typeSpeed: 100,
      loop: true,
      backSpeed: 100,
    };

    typed.current = new Typed(el.current, options);

    return () => {
      typed.current.destroy();
    };
  }, []);

  const handleStartExploring = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/authentication/AuthLayout");
    }, 3000);
  };
  return (
    <>
      <div
        className="relative h-[100vh] flex items-center justify-center bg-cover bg-center w-full pt-16"
        style={{ backgroundImage: `url(${HeroImg.src})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="text-white text-center z-10 p-6 md:p-20">
          <h1 className="text-4xl md:text-6xl font-light mb-4 font-mont">
            Embark on a Journey to <span ref={el} className=""></span>
          </h1>
          <div className="flex justify-center w-full text-md md:text-xl text-white text-center font-mont mb-8">
            <p className="w-full md:w-1/2">
              Immerse yourself in timeless stories, profound teachings, and
              captivating narratives. Explore new worlds, reflect on life's
              mysteries, and experience the power of the word of God.
            </p>
          </div>

          <div className="animate-fade-in-up delay-300 flex justify-center">
            <Link href="/authentication/AuthLayout">
              {isLoading ? (
                <button
                  className="bg-gray-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-mont flex items-center space-x-2"
                  disabled
                >
                  Loading...
                </button>
              ) : (
                <button
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-mont flex items-center space-x-2"
                  onClick={handleStartExploring}
                >
                  <FiLogIn size={20} />
                  <span>Start Exploring!</span>
                </button>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
