import React, { useState, useRef } from "react"
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
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

function TrackStatus() {
  const [grievance, setGrievance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const formRef = useRef()

  async function handleTrackStatus(e) {
    e.preventDefault()
    const grievanceId = formRef.current.grievanceId.value.trim()
    if (!grievanceId) return

    setLoading(true)
    setError("")
    setGrievance(null)

    try {
      const apiUrl = getApiUrl()
      const res = await fetch(`${apiUrl}/api/grievances/track/${grievanceId}`)
      
      let data
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await res.json()
      } else {
        throw new Error("Unable to contact backend server. Verify the server is running.")
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to locate grievance")
      }

      setGrievance(data)
    } catch (err) {
      setError(err.message || "Grievance ID not found. Verify and retry.")
    } finally {
      setLoading(false)
    }
  }

  // Stepper helper
  const getStepStatus = (currentStatus, step) => {
    const statusOrder = { "Pending": 1, "Under Review": 2, "Resolved": 3 }
    const currentLevel = statusOrder[currentStatus || "Pending"] || 1
    const targetLevel = statusOrder[step]
    
    if (currentLevel >= targetLevel) {
      return "completed"
    } else if (currentLevel + 1 === targetLevel) {
      return "next"
    }
    return "locked"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />

      <div className="flex flex-col items-center py-12 min-h-screen">
        <div className="w-full max-w-xl glass-card p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Track Status</h1>
            <p className="text-gray-400 text-sm mt-2">Enter your Grievance Database ID to view real-time audit progress.</p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleTrackStatus}
            className="flex flex-col gap-4 mb-6"
          >
            <div>
              <label className="premium-label" htmlFor="grievanceId">Grievance Reference ID</label>
              <input
                required
                id="grievanceId"
                name="grievanceId"
                type="text"
                placeholder="e.g. 64b8f07... (24 character hex ID)"
                className="premium-input"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="spinner-sm"></span>
                  <span>Searching...</span>
                </>
              ) : (
                <span>Track Status</span>
              )}
            </button>
          </form>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 text-rose-400 text-center text-sm">
              ⚠️ {error}
            </div>
          )}

          {grievance && (
            <div className="mt-8 border-t border-white/10 pt-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 text-center">Status Timeline</h2>
              
              {/* Stepper Component */}
              <div className="flex items-center justify-between mb-8 max-w-sm mx-auto">
                {/* Step 1: Submitted */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <span className="text-xs text-gray-300 font-semibold mt-2">Submitted</span>
                </div>

                <div className={`flex-1 h-0.5 mx-2 ${getStepStatus(grievance.status, "Under Review") === "completed" ? "bg-emerald-500" : "bg-white/10"}`}></div>

                {/* Step 2: Under Review */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border
                    ${getStepStatus(grievance.status, "Under Review") === "completed" 
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                      : getStepStatus(grievance.status, "Under Review") === "next" 
                        ? "bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse" 
                        : "bg-white/5 border-white/10 text-gray-500"
                    }`}
                  >
                    {getStepStatus(grievance.status, "Under Review") === "completed" ? "✓" : "2"}
                  </div>
                  <span className={`text-xs mt-2 ${getStepStatus(grievance.status, "Under Review") !== "locked" ? "text-gray-300 font-semibold" : "text-gray-500"}`}>
                    Under Review
                  </span>
                </div>

                <div className={`flex-1 h-0.5 mx-2 ${getStepStatus(grievance.status, "Resolved") === "completed" ? "bg-emerald-500" : "bg-white/10"}`}></div>

                {/* Step 3: Resolved */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border
                    ${getStepStatus(grievance.status, "Resolved") === "completed" 
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                      : "bg-white/5 border-white/10 text-gray-500"
                    }`}
                  >
                    {getStepStatus(grievance.status, "Resolved") === "completed" ? "✓" : "3"}
                  </div>
                  <span className={`text-xs mt-2 ${getStepStatus(grievance.status, "Resolved") === "completed" ? "text-gray-300 font-semibold" : "text-gray-500"}`}>
                    Resolved
                  </span>
                </div>
              </div>

              {/* Grievance Details Card */}
              <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-xs text-gray-500 font-mono">ID: {grievance._id}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border 
                    ${grievance.status === "Resolved" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : grievance.status === "Under Review" 
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {grievance.status || "Pending"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs">Submitted By</span>
                    <span className="text-gray-300 font-medium">{grievance.fname}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Email</span>
                    <span className="text-gray-300 font-medium">{grievance.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">District</span>
                    <span className="text-gray-300 font-medium">{grievance.district}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Recruiting Body</span>
                    <span className="text-gray-300 font-medium uppercase">{grievance.board}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block text-xs">Post</span>
                    <span className="text-gray-300 font-medium">{grievance.post || "N/A"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block text-xs">Issue Type</span>
                    <span className="text-blue-400 font-medium">{issueTypeMap[grievance.issueType] || grievance.issueType}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-white/5">
                    <span className="text-gray-500 block text-xs mb-0.5">Description</span>
                    <p className="text-gray-300 text-xs leading-relaxed italic bg-slate-950/40 p-2.5 rounded border border-white/5">
                      "{grievance.desc || "No description provided."}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TrackStatus
