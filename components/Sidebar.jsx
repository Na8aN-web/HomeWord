import React, { use, useState } from "react";
import { FaBible, FaSearch, FaBookOpen, FaGamepad } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { auth } from "../firebase"; 

const Sidebar = ({ isSidebarOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const isActive = (pathname) => {
    return router.pathname === pathname ? " border-s-4 border-x-white" : "";
  };

   const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/authentication/AuthLayout"); 
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      className={`fixed lg:relative h-screen w-full lg:w-1/6 bg-gray-800  text-white transition-transform duration-300 transform z-50 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex justify-center h-24">
        <h1 className="font-mont text-[24px] text-white font-light p-8 hidden sm:block">
          HomeWord
        </h1>
      </div>
      <hr className="w-full border-t border-white"></hr>
      <div className="mb-4"></div>
      <nav className="w-full">
        <ul>
          <li className={isActive("/dashboard/Home")}>
            <Link href="/dashboard/Home">
              <h6 className="text-white hover:text-gray-800 hover:bg-white hover:font-semibold py-1 flex items-center w-full">
                <span className="flex items-center p-3 font-mont">
                  <FaBible className="mr-2" />{" "}
                  <span className="ml-2">Read the Bible</span>
                </span>
              </h6>
            </Link>
          </li>

          <li className={isActive("/dashboard/Search")}>
            <Link href="/dashboard/Search">
              <h6 className="text-white hover:text-gray-800 hover:bg-white hover:font-semibold py-1 flex items-center w-full">
                <span className="flex items-center p-3 font-mont">
                  <FaSearch className="mr-2" />{" "}
                  <span className="ml-2">Search the Bible</span>
                </span>
              </h6>
            </Link>
          </li>

          <li className={isActive("/dashboard/Stories")}>
            <Link href="/dashboard/Stories">
              <h6 className="text-white hover:text-gray-800 hover:bg-white hover:font-semibold py-1 flex items-center w-full">
                <span className="flex items-center p-3 font-mont">
                  <FaBookOpen className="mr-2" />{" "}
                  <span className="ml-2">Bible Stories</span>
                </span>
              </h6>
            </Link>
          </li>

          <li className={isActive("/dashboard/Game")}>
            <Link href="/dashboard/Game">
              <h6 className="text-white hover:text-gray-800 hover:bg-white hover:font-semibold py-1 flex items-center w-full">
                <span className="flex items-center p-3 font-mont">
                  <FaGamepad className="mr-2" />{" "}
                  <span className="ml-2">Bible Games</span>
                </span>
              </h6>
            </Link>
          </li>

          <li>
            <Link href="#" onClick={handleSignOut}>
              <h6 className="text-white  hover:bg-red-500 hover:font-semibold py-1 flex items-center w-full">
                <span className="flex items-center p-3 font-mont">
                  <FiLogIn className="mr-2" />{" "}
                  <span className="ml-2">Logout</span>
                </span>
              </h6>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
