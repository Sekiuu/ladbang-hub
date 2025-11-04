"use client"

import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function VerticalNavbar() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signin") {
    return null;
  }
  return (
    <div className="hidden md:flex md:flex-col bg-white border-r border-gray-200 md:w-60 items-center p-4 space-y-4 text-gray-800 font-bold">
      <div className='flex flex-col gap-2 '>
      <Link href="/" className='hover:bg-blue-500 px-4 py-1 rounded-md duration-200'>Home</Link>
      <Link href="/profile"  className='hover:bg-blue-500 px-4 py-1 rounded-md duration-200'>Profile</Link>
      <Link href="/addrecord" className='hover:bg-blue-500 px-4 py-1 rounded-md duration-200'>Add Record</Link>
      </div>
    </div>
  )
}

export default VerticalNavbar