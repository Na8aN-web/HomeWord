import React, { useState, useEffect } from "react";
import axios from "axios";
import bibleBooks from "../../store/bibleBooks";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";

const Stories = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapterHeadings, setChapterHeadings] = useState([]);
  const [totalChapters, setTotalChapters] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContents, setChapterContents] = useState({});
  const [step, setStep] = useState(0);

  const fetchTotalChapters = async (book) => {
    try {
      const response = await axios.get(
        `https://api.esv.org/v3/passage/text/?q=${book}`,
        {
          headers: {
            Authorization: "Token 0bb8d869cefbcf972bea88fabc5182de2f58d6bd", // Replace with your actual API key
          },
        }
      );

      const passages = response.data.passages.join("\n");
      const chapterCount = (passages.match(/\[\d+\]/g) || []).length;

      setTotalChapters(chapterCount);
    } catch (error) {
      console.error("Error fetching total chapters:", error);
    }
  };

  const handleBookChange = (selectedOption) => {
    setSelectedBook(selectedOption);
    setSelectedChapter(null);
    fetchTotalChapters(selectedOption.value);
    fetchChapterHeadings(selectedOption.value);
    setStep(step + 1);
  };

  const handleChapterChange = (selectedOption) => {
    setSelectedChapter(selectedOption);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  useEffect(() => {
    if (selectedBook && totalChapters > 0) {
      fetchChapterHeadings(selectedBook.value);
    }
  }, [selectedBook, totalChapters]);

  const fetchChapterHeadings = async (book) => {
    try {
      const response = await axios.get(
        `https://api.esv.org/v3/passage/text/?q=${book} 1-${totalChapters}&include-heading-horizontal-lines=true`,
        {
          headers: {
            Authorization: "Token 0bb8d869cefbcf972bea88fabc5182de2f58d6bd", // Replace with your actual API key
          },
        }
      );

      if (response.status === 200) {
        const passages = response.data.passages[0];
        const sections = passages.split("\n\n");
        const headings = sections
          .filter((section) => section.trim().startsWith("_"))
          .map((heading) => heading.trim().replace(/^_+/, "")); // Remove leading underscores

        setChapterHeadings(headings);
      }
    } catch (error) {
      console.error("Error fetching chapter headings:", error);
    }
  };

  useEffect(() => {
    if (selectedChapter) {
      fetchChapterContents(selectedBook.value, selectedChapter.value);
    }
  }, [selectedChapter, selectedBook]);

  const fetchChapterContents = async (book, chapter) => {
    try {
      const response = await axios.get(
        `https://api.esv.org/v3/passage/text/?q=${book} ${chapter}&include-passage-references=false&include-headings=false&include-verse-numbers=false`,
        {
          headers: {
            Authorization: "Token 0bb8d869cefbcf972bea88fabc5182de2f58d6bd", // Replace with your actual API key
          },
        }
      );

      if (response.status === 200) {
        const chapterText = response.data.passages.join("\n");
        setChapterContents((prevContents) => ({
          ...prevContents,
          [chapter]: chapterText,
        }));
      }
    } catch (error) {
      console.error("Error fetching chapter contents:", error);
    }
  };

  const customStyles = {
    option: (provided, { isFocused }) => ({
      ...provided,
      fontFamily: "Montserrat, sans-serif",
      backgroundColor: isFocused ? "#2D3748" : "white", // Change bg color on hover
      color: isFocused ? "white" : "#2D3748",
    }),
    control: (provided) => ({
      ...provided,
      fontFamily: "Montserrat, sans-serif",
    }),
  };
  return (
    <ProtectedRoute>
      <AnimatePresence>
        <DashboardLayout>
          <div className="p-8 md:p-2">
            <h2 className="font-mont text-[24px]">
              Pick a book of the bible and explore the various stories
            </h2>
            <div>
              {step === 0 && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, x: -100 }} // Initial position and opacity
                  animate={{ opacity: 1, x: 0 }} // Animate to full opacity and default position
                  exit={{ opacity: 0, x: -100 }} // Animate to exit with sliding to the left
                  transition={{ duration: 0.3 }} // Exit off-screen position and opacity
                  key="step0" // Ensure a unique key when animating between steps
                >
                  <h3 className="text-md font-light text-gray-800 my-4 font-mont">
                    Select a Book
                  </h3>
                  <Select
                    options={bibleBooks.map((book) => ({
                      value: book,
                      label: book,
                    }))}
                    value={selectedBook}
                    onChange={handleBookChange}
                    isClearable={true}
                    styles={customStyles}
                  />
                </motion.div>
              )}
            </div>
            {step === 1 && selectedBook && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, x: -100 }} // Initial position and opacity
                animate={{ opacity: 1, x: 0 }} // Animate to full opacity and default position
                exit={{ opacity: 0, x: -100 }} // Animate to exit with sliding to the left
                transition={{ duration: 0.3 }} // Exit off-screen position and opacity
                key="step1" // Ensure a unique key when animating between steps
              >
                <div>
                  <label className="block text-md font-mont font-light text-gray-800 mt-4 mb-8">
                    <div className="flex gap-4">
                      <h4
                        className="border-b-[1px] border-b-gray-800 hover:cursor-pointer"
                        onClick={() => setStep(0)}
                      >
                        Select a Book
                        <span className="bg-gray-800 text-white px-2">
                          {selectedBook.value}
                        </span>
                      </h4>
                      |<h4>Select a Story:</h4>
                    </div>
                  </label>
                  <Select
                    options={chapterHeadings.map((heading) => ({
                      value: heading,
                      label: heading,
                    }))}
                    value={selectedChapter}
                    onChange={handleChapterChange}
                    isClearable={true}
                    styles={customStyles}
                  />
                </div>
                {selectedChapter && (
                  <div>
                    <p className="whitespace-pre-line font-mont leading-loose pt-8">
                      {chapterContents[selectedChapter.value] ||
                        "Loading chapter contents..."}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </DashboardLayout>
      </AnimatePresence>
    </ProtectedRoute>
  );
};

export default Stories;
