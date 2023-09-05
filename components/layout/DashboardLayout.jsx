import React, { useState } from "react";
import Navbar from "../navbar/DashboardNavbar";
import Sidebar from "../Sidebar";

const DashboardLayout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div
        className={`flex-1 ${
          isSidebarOpen ? "w-full" : "w-0" // Use "w-0" to hide the sidebar when it's closed
        } transition-all duration-300 flex flex-col`}
      >
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
        <div className="flex-1 bg-[#f4f4f4] overflow-y-auto p-0 sm:p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
