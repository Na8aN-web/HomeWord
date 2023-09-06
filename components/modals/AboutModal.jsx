import Link from "next/link";
import React, { useEffect, useRef } from "react";

const AboutModal = ({ isOpen, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Call the onClose function to close the modal
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    isOpen && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 p-8">
        <div ref={modalRef} className="bg-gray-800 p-4 w-3/4 md:w-1/2 h-96 md:h-auto rounded-md overflow-auto">
          <h2 className="text-lg text-white mb-2 font-mont">Hi i'm Nathan</h2>
          <p className="text-sm font-mont text-white">
            This is a personal project Bible website I built using Next, Tailwind
            and Firebase, it includes features such as authorization, reading
            the bible, bible stories, search functionality, and a bible game
            with leaderboard stats
          </p>
          <p className="text-sm font-mont text-white">
            If you have any questions, feel free to reach out to me at{" "}
            <a href="mailto:oblivin008@gmail.com">oblivin008@gmail.com</a>, and if you'd like to take a look at more of my
            projects, refer to my portfolio link below.
          </p>
          <Link
            className="text-blue-500 my-4 font-mont"
            href="https://na8an-web.github.io/Portfolio/myportfolio/index.html"
          >
            PORTFOLIO
          </Link>
        </div>
      </div>
    )
  );
};

export default AboutModal;
