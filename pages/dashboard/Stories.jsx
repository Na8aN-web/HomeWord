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
  const [chapterContent, setChapterContent] = useState("");
  const [totalChapters, setTotalChapters] = useState(0);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedChapterContent, setSelectedChapterContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);

  const handleBookChange = (selectedOption) => {
    setSelectedBook(selectedOption.value);
    setSelectedStory(null);
    setTotalChapters(selectedOption.chapterCount);
    setIsLoading(true);
  };

  const handleNextStep = () => {
    setStep(step + 1);
    fetchChapterHeadings();
  };

  const handleStoryChange = async (selectedOption) => {
    setSelectedStory(selectedOption.value);
    const headingIndex = chapterHeadings.indexOf(selectedOption.value);
    if (headingIndex !== -1) {
      // Remove the chapter heading from the content
      const contentWithoutHeading = chapterContent[headingIndex].replace(selectedOption.value, '');
      setSelectedChapterContent(contentWithoutHeading);
    }
  };

  const fetchChapterHeadings = async () => {
    try {
      const response = await axios.get(
        `https://api.esv.org/v3/passage/text/?q=${selectedBook} 1-${totalChapters}&include-heading-horizontal-lines=true&include-verse-numbers=false&include-footnotes=false&include-footnote-body=false&include-short-copyright=false`,
        {
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_ESV_API_TOKEN}`,
          },
        }
      );
      if (response.status === 200) {
        const passages = response.data.passages[0];
        const sections = passages.split("\n\n");

        const chapterHeadings = [];
        const chapterContents = [];
        let currentHeading = "";

        for (const section of sections) {
          if (section.trim().startsWith("_")) {
            // Store the current heading and start a new one
            currentHeading = section.trim().replace(/^_+/, "");
            chapterHeadings.push(currentHeading);
            chapterContents.push(currentHeading); // Include the heading in the content array
          } else {
            // Append content to the current chapter
            chapterContents[chapterContents.length - 1] += "\n\n" + section;
          }
        }

        setChapterHeadings(chapterHeadings);
        setChapterContent(chapterContents);
      }
    } catch (error) {
      console.error("Error fetching chapter headings:", error);
    } finally {
      setIsLoading(false); // Set loading state to false when done
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
            <h2 className="font-mont text-[20px] md:text-[24px]">
              Pick a book of the Bible and explore the various stories
            </h2>
            <div>
              {step === 0 && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  key="step0"
                >
                  <h3 className="text-md font-light text-gray-800 my-4 font-mont">
                    Select a Book
                  </h3>

                  <Select
                    options={bibleBooks.map((bookObj, index) => ({
                      value: bookObj.book,
                      label: bookObj.book,
                      chapterCount: bookObj.chapterCount,
                    }))}
                    value={{
                      value: selectedBook,
                      label: selectedBook,
                    }}
                    onChange={handleBookChange}
                    isClearable={true}
                    styles={customStyles}
                  />
                  {selectedBook ? (
                    <motion.button
                      className="mt-4 px-4 py-2 bg-gray-800 text-white hover:bg-white hover:text-gray-800 font-mont focus:outline-none"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                      onClick={handleNextStep}
                    >
                      Next
                    </motion.button>
                  ) : null}
                </motion.div>
              )}
            </div>
            {step === 1 && selectedBook && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                key="step1"
              >
                <div>
                  <label className="block text-md font-mont font-light text-gray-800 mt-4 mb-8">
                    <div className="flex gap-4">
                      <h4
                        className="border-b-[1px] border-b-gray-800 hover:cursor-pointer"
                        onClick={() => setStep(0)}
                      >
                        Select a Book
                        <span className="bg-gray-800 text-white px-2 mx-2">
                          {selectedBook}
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
                    value={{
                      value: selectedStory,
                      label: selectedStory,
                    }}
                    onChange={handleStoryChange}
                    isClearable={true}
                    styles={customStyles}
                    isDisabled={isLoading} // Disable the Select input when loading
                    isLoading={isLoading}
                  />
                </div>
                {selectedStory && (
                  <div>
                    <p className=" font-mont leading-[40px] pt-8">{selectedChapterContent}</p>
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
