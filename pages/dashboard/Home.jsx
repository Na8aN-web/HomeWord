import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axios from "axios";
import bibleBooks from "../../store/bibleBooks"; // Import the list of Bible books
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import ProtectedRoute from "@/components/ProtectedRoute";

const Home = () => {
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedVerse, setSelectedVerse] = useState("");
  const [passageText, setPassageText] = useState("");
  const [availableChapters, setAvailableChapters] = useState([]);
  const [availableVerses, setAvailableVerses] = useState([]);
  const [fetchAllLoading, setFetchAllLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedBook) {
      fetchAvailableChapters();
    }
  }, [selectedBook]);

  useEffect(() => {
    if (selectedChapter) {
      fetchAvailableVerses();
    }
  }, [selectedChapter]);

  const fetchAvailableChapters = async () => {
    try {
      const response = await axios.get(
        `https://api.esv.org/v3/passage/text/?q=${selectedBook}`,
        {
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_ESV_API_TOKEN}`,
          },
        }
      );

      const passages = response.data.passages.join("\n");
      const chapterCount = (passages.match(/\[\d+\]/g) || []).length;

      setAvailableChapters(
        Array.from({ length: chapterCount }, (_, index) => index + 1)
      );
    } catch (error) {
      console.error("Error fetching available chapters:", error);
    }
  };

  const fetchAvailableVerses = async () => {
    try {
      const passageQuery = `${selectedBook} ${selectedChapter}`;
      const response = await axios.get(
        `https://api.esv.org/v3/passage/text/?q=${passageQuery}`,
        {
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_ESV_API_TOKEN}`,
          },
        }
      );

      const verses = response.data.passages.join("\n");
      const verseCount = (verses.match(/\[\d+\]/g) || []).length;

      setAvailableVerses(
        Array.from({ length: verseCount }, (_, index) => index + 1)
      );
    } catch (error) {
      console.error("Error fetching available verses:", error);
    }
  };

  const fetchAllVerses = async () => {
    setFetchAllLoading(true);
    try {
      const response = await axios.get(
        `https://api.esv.org/v3/passage/text/?q=${selectedBook} 1-${availableChapters}&include-headings=false&include-footnotes=false&include-footnote-body=false&include-short-copyright=false`,
        {
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_ESV_API_TOKEN}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response);
        setPassageText(response.data.passages);
      }
    } catch (error) {
      console.error("Error fetching chapter headings:", error);
    } finally {
      setFetchAllLoading(false);
    }
  };
  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleVerseClick = async (verse) => {
    setSelectedVerse(verse);
    setLoading(true);

    try {
      const passageQuery = `${selectedBook} ${selectedChapter}:${verse}`;
      const response = await axios.get(
        `https://api.esv.org/v3/passage/text/?q=${passageQuery}`,
        {
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_ESV_API_TOKEN}`,
          },
        }
      );

      setPassageText(response.data.passages[0]);
    } catch (error) {
      console.error("Error fetching passage text:", error);
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    option: (provided, { isFocused }) => ({
      ...provided,
      fontFamily: "Montserrat, sans-serif",
      backgroundColor: isFocused ? "#2D3748" : "white",
      color: isFocused ? "white" : "#2D3748",
    }),
    control: (provided) => ({
      ...provided,
      fontFamily: "Montserrat, sans-serif",
    }),
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AnimatePresence>
          <div className="">
            {step === 0 && (
              <motion.div
                className="mb-4  p-8 md:p-2"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                key="step0"
              >
                <motion.button
                  className="px-4 py-2 bg-gray-800 font-mont text-white rounded focus:outline-none m-8 hover:bg-white hover:text-gray-800"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={handleNextStep}
                >
                  What book of the Bible do you want to read?
                </motion.button>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                className="mb-4  p-8 md:p-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key="step1"
              >
                <form onSubmit={handleNextStep}>
                  <label className="block text-md font-light text-gray-800 mb-4 font-mont ">
                    Select a Book
                  </label>
                  <Select
                    options={bibleBooks.map((book, index) => ({
                      value: book,
                      label: book,
                    }))}
                    value={{ value: selectedBook, label: selectedBook }}
                    onChange={(selectedOption) =>
                      setSelectedBook(selectedOption.value)
                    }
                    styles={customStyles}
                    required
                  />
                  <motion.button
                    className="mt-4 px-4 py-2 bg-gray-800 text-white hover:bg-white hover:text-gray-800 font-mont focus:outline-none"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Next
                  </motion.button>
                </form>
              </motion.div>
            )}
            {step === 2 && availableChapters && (
              <motion.div
                className="mb-4  p-8 md:p-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key="step2"
              >
                <label className="block text-md font-mont font-light text-gray-800 mt-4 mb-8">
                  <div className="flex gap-4">
                    <h4
                      className="border-b-[1px] border-b-gray-800 hover:cursor-pointer"
                      onClick={() => setStep(1)}
                    >
                      Select a Book{" "}
                      <span className="bg-gray-800 text-white px-2">
                        {selectedBook}
                      </span>
                    </h4>{" "}
                    |<h4>Select a Chapter:</h4>
                  </div>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableChapters.map((chapter, index) => (
                    <motion.button
                      key={index}
                      className={`px-4 py-2 font-mont focus:outline-none ${
                        selectedChapter === chapter
                          ? "bg-gray-800 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                      onClick={() => setSelectedChapter(chapter)}
                    >
                      {chapter}
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  className={`mt-4 px-4 py-2 font-mont focus:outline-none ${
                    selectedChapter ? "bg-gray-800 text-white" : "invisible"
                  }`}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={handleNextStep}
                >
                  Next
                </motion.button>
              </motion.div>
            )}

            {step === 3 && availableVerses.length > 0 && (
              <motion.div
                className="mb-4  p-8 md:p-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key="step3"
              >
                <label className="block text-md font-mont font-light text-gray-800 mt-4 mb-8">
                  <div className="flex gap-4">
                    <h4
                      className="border-b-[1px] border-b-gray-800 hover:cursor-pointer"
                      onClick={() => setStep(1)}
                    >
                      Select a Book{" "}
                      <span className="bg-gray-800 text-white px-2">
                        {selectedBook}
                      </span>
                    </h4>{" "}
                    |
                    <h4
                      className="border-b-[1px] border-b-gray-800 hover:cursor-pointer"
                      onClick={() => setStep(2)}
                    >
                      Select a Chapter{" "}
                      <span className="bg-gray-800 text-white px-2">
                        {selectedChapter}
                      </span>
                    </h4>{" "}
                    |<h4>Select a verse: </h4>
                  </div>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableVerses.map((verse, index) => (
                    <motion.button
                      key={index}
                      className={`px-4 py-2 font-mont focus:outline-none ${
                        selectedVerse === verse
                          ? "bg-gray-800 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                      onClick={() => handleVerseClick(verse)}
                    >
                      {verse}
                    </motion.button>
                  ))}
                  <motion.button
                    className="px-4 py-2 font-mont focus:outline-none
                      bg-gray-200 text-gray-800"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    onClick={fetchAllVerses}
                  >
                    {fetchAllLoading ? "Loading..." : "Open All Verses"}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {passageText && (
              <motion.div
                className="border-[1px] p-4 shadow-md bg-gray-200"
                whileHover={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <p className="whitespace-pre-line font-mont">
                  {loading ? "Loading..." : passageText}
                </p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Home;
