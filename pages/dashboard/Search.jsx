import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import ProtectedRoute from "@/components/ProtectedRoute";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setTimeout(() => {
      try {
        setCurrentPage(1);
        fetchSearchResults(1);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    }, 500); // Delay the API call by 100ms
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

  const fetchSearchResults = async (page) => {
    try {
      const response = await axios.get(
        `https://api.esv.org/v3/passage/search/?q=${searchTerm}&page=${page}`,
        {
          headers: {
            Authorization: "Token 0bb8d869cefbcf972bea88fabc5182de2f58d6bd",
          },
        }
      );
      const data = response.data.results;
      setSearchResults(data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchSearchResults(newPage); // Fetch results for the new page
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -100 }} // Initial position and opacity
            animate={{ opacity: 1, x: 0 }} // Animate to full opacity and default position
            exit={{ opacity: 0, x: -100 }} // Animate to exit with sliding to the left
            transition={{ duration: 0.3 }} // Animation duration
            className=" p-8 md:p-2"
          >
            <h1 className="font-mont text-[20px] md:text-[24px] my-8">
              Search for various texts in the bible and get all related
              passages!
            </h1>
            <motion.input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search term"
              className="font-mont px-8 py-2 w-52 md:w-96 focus:outline-none"
              initial="initial"
              whileFocus="focus"
            />
            <motion.button
              className="mt-4 px-4 py-2 bg-gray-800 text-white hover:bg-white hover:text-gray-800 font-mont focus:outline-none"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              disabled={loading}
              onClick={handleSearch}
            >
              {loading ? "Loading..." : "Fetch Passage"}
            </motion.button>

            {searchResults.length > 0 && (
              <div className="mt-4 font-mont">
                <Select
                  options={Array.from({ length: totalPages }, (_, index) => ({
                    value: index + 1,
                    label: `Page ${index + 1}`,
                  }))}
                  value={{ value: currentPage, label: `Page ${currentPage}` }}
                  onChange={(selectedOption) =>
                    handlePageChange(selectedOption.value)
                  }
                  styles={customStyles}
                  // Add more styling and customization props as needed
                />
              </div>
            )}
            <div className="mt-4">
              {searchResults.map((passage, index) => (
                <div key={`${index}-${passage.id}`} className="font-mont my-8">
                  <p className="font-bold">{passage.reference}</p>
                  <div>
                    {passage.content
                      .split(new RegExp(`(${searchTerm})`, "gi"))
                      .map((part, idx) =>
                        part.toLowerCase() === searchTerm.toLowerCase() ? (
                          <span
                            key={`${index}-${idx}`}
                            className="font-bold pulsating-text"
                          >
                            {part}
                          </span>
                        ) : (
                          <span key={`${index}-${idx}`}>{part}</span>
                        )
                      )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SearchComponent;
