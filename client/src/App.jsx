import React from "react"
import { Outlet } from "react-router-dom"
import GrievanceBoard from "./Components/GrievanceBoard"
import Navbar from "./Components/Navbar.jsx"
import Footer from "./Components/Footer.jsx"

function App() {
  return (
    <div className="ms-2">
      <Navbar />
      <main className="flex flex-col md:flex-row justify-center gap-5 py-12 border-b-2 border-gray-100">
        <div className="w-80 h-50  md:w-100 md:h-80">
          <img className=" object-cover" src="/bell.png" alt="bell" />
        </div>
        <div className="mt-[30px] ">
          <h2 className="md:max-w-[500px] text-2xl md:text-6xl font-bold md:leading-[70px]">
            Speak Up for Fair Exams and Recruitment
          </h2>
          <p className="text-muted text-xl md:max-w-[420px] my-5 ">
            Submit your grievances regarding exam postponements, recruitment
            irregularities, and more.
          </p>
          <a
            href="/submitGrievance"
            className="cursor-pointer bg-blue-500 rounded-md text-white px-5 p-3 font-medium mt-10 hover:"
          >
            Submit a Grievance
          </a>
        </div>
      </main>
      <div>
        <GrievanceBoard />
      </div>
      <div className="my-3 flex flex-col gap-5 border-b-2 border-gray-100">
        <h3 className="text-3xl font-bold  text-center">How It Works</h3>
        <div className="flex flex-col md:flex-row justify-evenly mx-10">
          <div className="flex flex-col items-center gap-2">
            <span className="bg-blue-600 w-[50px] h-[50px] rounded-full text-white flex justify-center items-center text-xl">
              1
            </span>
            <span className="text-xl font-semibold">Submit</span>
            <p className="text-muted max-w-[250px] text-center">
              Fill out the grievance form according to your issue
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="bg-blue-600 w-[50px] h-[50px] rounded-full text-white flex justify-center items-center text-xl">
              2
            </span>
            <span className="text-xl font-semibold">Review</span>
            <p className="text-muted max-w-[250px] text-center">
              After that your Feedback'll be examined at the Backend
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="bg-blue-600 w-[50px] h-[50px] rounded-full text-white flex justify-center items-center text-xl">
              3
            </span>
            <span className="text-xl font-semibold">Display</span>
            <p className="text-muted max-w-[250px] text-center">
              If the feedback is genuine and is written in modest language, It
              may be Displayed on the Site.
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <Outlet />
    </div>
  )
}

export default App
