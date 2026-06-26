import React from "react"
import { Outlet } from "react-router-dom"
import GrievanceBoard from "./Components/GrievanceBoard"
import Navbar from "./Components/Navbar.jsx"
import Footer from "./Components/Footer.jsx"

function App() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <main className="flex flex-col md:flex-row items-center justify-center gap-12 py-16 border-b border-white/10">

        <div className="flex flex-col items-start text-left max-w-xl">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Speak Up for <span className="text-blue-500 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Fair Exams</span> and Recruitment
          </h2>
          <p className="text-gray-400 text-lg md:text-xl my-6 leading-relaxed">
            Submit your grievances regarding exam postponements, recruitment irregularities, paper leaks, and other concerns.
          </p>
          <a
            href="/submitGrievance"
            className="inline-flex items-center justify-center cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-lg font-semibold text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 active:scale-95"
          >
            Submit a Grievance
          </a>
        </div>
      </main>
      <div className="py-12">
        <GrievanceBoard />
      </div>
      <div className="py-12 border-t border-white/10">
        <h3 className="text-3xl font-bold text-center text-white mb-10">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="glass-card p-6 flex flex-col items-center text-center gap-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 w-12 h-12 rounded-full flex justify-center items-center text-xl font-bold">
              1
            </span>
            <span className="text-xl font-semibold text-white">Submit</span>
            <p className="text-gray-400 text-sm">
              Fill out the grievance form with precise details and documents regarding your issue.
            </p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center text-center gap-4">
            <span className="bg-purple-600/20 text-purple-400 border border-purple-500/30 w-12 h-12 rounded-full flex justify-center items-center text-xl font-bold">
              2
            </span>
            <span className="text-xl font-semibold text-white">Review</span>
            <p className="text-gray-400 text-sm">
              Your feedback is audited by the administration to evaluate validity and claim.
            </p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center text-center gap-4">
            <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 w-12 h-12 rounded-full flex justify-center items-center text-xl font-bold">
              3
            </span>
            <span className="text-xl font-semibold text-white">Display</span>
            <p className="text-gray-400 text-sm">
              Genuine issues meeting submission rules are broadcasted publicly for community tracking.
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
