const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  return (
    <div className="flex justify-center mt-12">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className=" md:text-[13px] text-[10px] mr-8 font-mont w-8 md:w-12 h-8 md:h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-pink-500 hover:to-indigo-500 hover:bg-gradient-to-r hover:text-white transition-all duration-300  rounded-full flex items-center justify-center text-white font-bold"
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={`w-8 md:w-12 h-8 md:h-12 rounded-full ${
            index + 1 === currentPage
              ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-pink-500 hover:to-indigo-500 hover:bg-gradient-to-r hover:text-white rounded-full transition-all duration-300  text-white font-bold"
              : "bg-gray-300 text-gray-800 hover:bg-blue-500 hover:text-white"
          } flex items-center font-mont justify-center mr-2 md:text-[13px] text-[10px]`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="md:text-[13px] text-[10px] font-mont w-8 md:w-12 h-8 md:h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-pink-500 hover:to-indigo-500 hover:bg-gradient-to-r hover:text-white rounded-full transition-all duration-300  flex items-center justify-center ml-8 text-white font-bold"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
