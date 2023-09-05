import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

const VerseOfTheDayModal = ({ isModalOpen, verse, closeModal }) => {
  const modalRef = useRef();
  const typedRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      // Initialize Typed.js when the modal is open
      const options = {
        strings: [verse],
        typeSpeed: 40, // Adjust the typing speed as needed
        showCursor: true, // Show the typing cursor
      };

      typedRef.current = new Typed(".typed-text", options);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);

      // Destroy Typed.js when the modal is closed
      if (typedRef.current) {
        typedRef.current.destroy();
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, closeModal, verse]);

  return (
    isModalOpen && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-4 w-1/2 rounded-md" ref={modalRef}>
          <h2 className="text-lg font-semibold mb-2 font-mont">
            Verse of the Day
          </h2>
          {/* Use a class for the Typed.js target element */}
          <p className="text-sm font-mont typed-text"></p>
        </div>
      </div>
    )
  );
};

export default VerseOfTheDayModal;
