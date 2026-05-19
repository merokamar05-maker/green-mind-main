
"use client"
import React from "react"
import Link from "next/link"
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });
export default function ForgetPassword() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className=" shadow-lg rounded-2xl p-8 w-full">
      

        {/* <form method="POST" action="/api/forgetPassword" className="space-y-4"> */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email or phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              required
            />

          <p className="text-[#407BFF] font-semibold text-[18px] mt-2">
  Forget  email ?
</p>

          </div>

         
<p className={`${poppins.className} text-[#407BFF] text-[18px] text-right p-2 font-bold text`}>
  {" Create account? "}
 <Link href="/Signup">
  <button className="bg-[#407BFF] text-[#FFFFFF] text-[18px] px-4 py-2 rounded-xl font-semibold cursor-pointer hover:opacity-80 transition">
    Next
  </button>
</Link>
</p>
        {/* </form> */}
      </div>
    </div>
  )
}

