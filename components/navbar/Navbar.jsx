import React from 'react';
import Link from 'next/link';


const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between fixed z-50 w-full items-center">
      {/* Logo */}
      <div className="flex items-center space-x-2 ">
        <h1 className='font-mont text-[24px] text-white font-light'>HomeWord</h1>
        <p className='font-mont text-white text-[12px] pt-[2px]'>ESV Bible version</p>
      </div>
    </nav>
  );
};

export default Navbar;
