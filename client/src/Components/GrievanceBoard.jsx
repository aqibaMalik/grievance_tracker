import React, { useEffect, useState } from "react"
import { getApiUrl } from "../utils/api"

const issueTypeMap = {
  "unfairmeans": "Unfair Means",
  "dateDefer": "Date Deferment",
  "refundPending": "Pending Refund",
  "delayedExam": "Delayed Exam",
  "resultDelay": "Result Delay",
  "Unfair Means": "Unfair Means",
  "Date Deferment": "Date Deferment",
  "Pending Refund": "Pending Refund",
  "Delayed Exam": "Delayed Exam",
  "Result Delay": "Result Delay",
  "Others": "Others"
}

function GrievanceBoard() {
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchGrievances() {
    try {
      const apiUrl = getApiUrl()
      const res = await fetch(apiUrl)
      
      let data
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await res.json()
      } else {
        throw new Error("Invalid response content type")
      }

      if (!res.ok) throw new Error("Failed to fetch")
      return data
    } catch (err) {
      console.error("Error fetching grievances:", err)
      return []
    }
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await fetchGrievances()
      setGrievances(data)
      setLoading(false)
    }
    loadData()
  }, [])

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
      case "Under Review":
        return "bg-blue-500/15 text-blue-400 border-blue-500/20"
      default:
        return "bg-amber-500/15 text-amber-400 border-amber-500/20"
    }
  }

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md animate-fade-in">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-white tracking-tight">
        📋 Grievance Board
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="spinner"></div>
          <p className="text-gray-400 text-sm animate-pulse">Loading grievances...</p>
        </div>
      ) : grievances.length === 0 ? (
        <p className="text-center text-gray-400 py-12">
          No grievances submitted yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grievances.map((g) => (
            <div
              key={g._id}
              className="glass-card p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-white truncate max-w-[150px]">
                      {g.fname}
                    </h2>
                    {g.createdAt && (
                      <span className="inline-block self-start mt-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">
                        📅 {new Date(g.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    )}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(g.status || "Pending")}`}>
                    {g.status || "Pending"}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>
                    <strong className="text-gray-300">Email:</strong> <span className="text-gray-400">{g.email}</span>
                  </p>
                  <p>
                    <strong className="text-gray-300">District:</strong> <span className="text-gray-400">{g.district}</span>
                  </p>
                  <p>
                    <strong className="text-gray-300">Post:</strong>{" "}
                    <span className="text-gray-400">{g.post || "No Post mentioned"}</span>
                  </p>
                  <p>
                    <strong className="text-gray-300">Board:</strong> <span className="text-gray-400 uppercase">{g.board}</span>
                  </p>
                  <p>
                    <strong className="text-gray-300">Issue Type:</strong>{" "}
                    <span className="text-blue-400 font-medium">
                      {issueTypeMap[g.issueType] || g.issueType || "Others"}
                    </span>
                  </p>
                  <div className="pt-2 border-t border-white/5 mt-2">
                    <strong className="text-gray-300 block mb-1">Description:</strong>
                    <p className="text-gray-400 line-clamp-3 text-xs italic">
                      "{g.desc || "No Description mentioned"}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GrievanceBoard
