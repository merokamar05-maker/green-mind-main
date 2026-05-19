import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";


export default function Navbar() {
  return (
    <nav className="backdrop-hidden-md bg-white/0 border-b border-white/0 shadow-sm fixed top-0 left-0 w-full z-0">
          <div className="flex justify-end items-center gap-4 mb-8 bg-white/0  p-4 rounded-xl shadow lg:w-[100%]">
        <div className="left">
          <ul className="flex gap-2 lg:gap-6 items-center">
            <li className="text-2xl flex items-center gap-2">
              
              <Link href="/">
                
              </Link>

             

              </li>            
            {/* <li><Link href="/products">Products</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/brands">Brands</Link></li> */}
          </ul>
         
        
        </div>

        <div className="right">
          <ul className="flex gap-4 items-center">
            {/* <li><i className="fab fa-facebook"></i></li>
            <li><i className="fab fa-twitter"></i></li>
            <li><i className="fab fa-instagram"></i></li>
            <li><i className="fab fa-linkedin"></i></li> */}
           {/* <li><Link href="/Signup"> Signup</Link></li>
            <li><Link href="/login">Login</Link></li>*/}
          </ul>
        </div>
      </div>
    </nav>
  );
}
