import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import BibleOpen from "../../public/bible-open.png";
import Image from "next/image";
import BibleClose from "../../public/bible-close.png";
import { motion, AnimatePresence } from "framer-motion";
import VerseOfTheDayModal from "../modals/VerseOfThdDay";

const DashboardNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const user = useSelector((state) => state.login.user);
  const [verse, setVerse] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch the Verse of the Day from the Bible.org API
    fetch("https://labs.bible.org/api/?passage=votd")
      .then((response) => response.text())
      .then((data) => {
        // Parse the response data to extract and format the first verse
        const firstVerse = parseFirstVerse(data);
        setVerse(firstVerse);
      })
      .catch((error) => {
        console.error("Error fetching Verse of the Day:", error);
      });
  }, []);

  const parseFirstVerse = (verseData) => {
    // Split the data by "<b>" tags to separate verses
    const verses = verseData
      .split("<b>")
      .filter((verse) => verse.trim() !== "");

    if (verses.length > 0) {
      const firstVerse = verses[0].split("</b>");
      if (firstVerse.length === 2) {
        const verseReference = firstVerse[0];
        const verseText = firstVerse[1];
        return `${verseReference} - ${verseText}`;
      }
    }

    return "Verse not found"; // Return a message if no verse is found
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center bg-[#f4f4f4] border-b-[1px] border-b-gray-800 p-4 h-24 relative">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-black fixed font-semibold text-[32px] font-roboto pl-4 focus:outline-none z-50"
        >
          <motion.div
            className="border-[1px] p-4 shadow-md bg-gray-200"
            whileHover={{
              scale: 1.01,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {isSidebarOpen ? (
              <Image
                alt="bible-open"
                src={BibleOpen}
                width={24}
                height={24}
                color="white"
              />
            ) : (
              <Image
                alt="bible-close"
                src={BibleClose}
                width={24}
                height={24}
              />
            )}
          </motion.div>
        </button>

        <VerseOfTheDayModal
          isModalOpen={isModalOpen}
          verse={verse}
          closeModal={closeModal}
        />
        <motion.div
          className="mb-4 absolute md:right-4 md:top-[-7px] top-[0px] right-0"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
        >
          <motion.button
            className="px-4 py-2 bg-gray-800 font-mont text-white rounded focus:outline-none m-8 hover:bg-white hover:text-gray-800"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            animate={{
              scale: [1, 1.05, 1],
              transition: {
                duration: 3,
                repeat: Infinity,
              },
            }}
            onClick={openModal}
          >
            <h1 className="font-medium text-[14px] md:text-[20px]">
              VERSE OF THE DAY
            </h1>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
