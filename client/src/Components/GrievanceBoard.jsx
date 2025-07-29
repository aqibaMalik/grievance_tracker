import React, { useEffect, useState } from "react"
function GrievanceBoard() {
  const [grievances, setGrievances] = useState([])
  const ENDPOINT = import.meta.env.VITE_API_URL
  console.log(ENDPOINT)
  async function fetchGrievances() {
    try {
      const res = await fetch(ENDPOINT)
      const data = await res.json()
      return data
    } catch (err) {
      console.log(err)
      return []
    }
  }

  useEffect(() => {
    async function loadData() {
      const data = await fetchGrievances()
      setGrievances(data)
    }
    loadData()
  }, [])

  return (
    <div className=" bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        📋 Grievance Board
      </h1>
      {grievances.length === 0 ? (
        <p className="text-center text-gray-500">
          No grievances submitted yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {grievances.map((g, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {g.fname}
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Email:</strong> {g.email}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>District:</strong> {g.district}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Post:</strong>{" "}
                {g.post === "" ? "No Post mentioned" : g.post}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Board:</strong> {g.board}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Issue Type:</strong> {g.issueType}
              </p>
              <p className="text-sm text-gray-500">
                <strong> Description:</strong>{" "}
                {g.desc === "" ? "No Descripton mentioned" : g.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GrievanceBoard
