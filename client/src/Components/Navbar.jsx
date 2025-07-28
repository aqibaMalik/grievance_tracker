import React from "react"

function Navbar() {
  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between p-5 border-b-2 border-gray-100">
        <h1 className="text-2xl font-bold">JK Grievance Tracker</h1>
        <nav>
          <ul className="flex items-center gap-3 font-lg">
            <li className="cursor-pointer  hover:underline active:text-blue-500 hover:text-blue-500">
              <a href="/">Home</a>
            </li>
            <li className="cursor-pointer hover:underline active:text-blue-500 hover:text-blue-500">
              <a href="/submitGrievance">Submit Grievance</a>
            </li>
            <li className="cursor-pointer  hover:underline active:text-blue-500 hover:text-blue-500 hover">
              <a href="/trackStatus">Track Status</a>
            </li>
            <li className="cursor-pointer bg-blue-500 rounded-md text-white px-3 p-2">
              <a href="#">Register/Login</a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  )
}

export default Navbar
