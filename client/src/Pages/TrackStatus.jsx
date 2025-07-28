import React from "react"
import { useRef } from "react"
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"

function TrackStatus() {
  const form = useRef()
  function handleTrackStatus(e) {
    e.preventDefault()
  }
  return (
    <div>
      <Navbar />

      <div className="flex-col flex items-center min-h-screen">
        <h1 className="text-4xl font-bold my-5">Track Status Using Id</h1>
        <form
          ref={form}
          onSubmit={handleTrackStatus}
          method="POST"
          action="http://localhost:3000"
          className="w-[300px] md:w-[500px] flex flex-col gap-3 "
        >
          <div>
            <label htmlFor="fname">Grievance ID</label>
            <input
              required
              id="grievanceId"
              name="grievanceId"
              type="text"
              className="w-full border-1 rounded-sm px-3 py-1 my-1 block"
            />
          </div>
          <button
            type="submit"
            className="w-full  bg-blue-700 py-2 rounded-md text-white cursor-pointer hover:bg-blue-500"
          >
            Track
          </button>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default TrackStatus
