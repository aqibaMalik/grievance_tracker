import React, { useState, useRef, useEffect } from "react"
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
import { getApiUrl } from "../utils/api"

function SubmitGrievance() {
  const [status, setStatus] = useState(null) // 'success', 'failure', or null
  const [errorMessage, setErrorMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [grievanceId, setGrievanceId] = useState(null)
  const [copied, setCopied] = useState(false)
  const formRef = useRef()

  // Auto-populate user info if logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser && formRef.current) {
      try {
        const user = JSON.parse(savedUser)
        if (user.username && formRef.current.fname) {
          formRef.current.fname.value = user.username
        }
        if (user.email && formRef.current.email) {
          formRef.current.email.value = user.email
        }
      } catch (err) {
        console.error("Error parsing saved user:", err)
      }
    }
  }, [])

  function handleCopyId() {
    if (!grievanceId) return
    navigator.clipboard.writeText(grievanceId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function handleGrievanceSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setGrievanceId(null)
    setStatus(null)

    const reqBody = {
      fname: formRef.current.fname.value,
      email: formRef.current.email.value,
      district: formRef.current.district.value,
      post: formRef.current.post?.value || "",
      board: formRef.current.board.value,
      issueType: formRef.current.issueType.value,
      desc: formRef.current.desc?.value || "",
    }

    try {
      const token = localStorage.getItem("token")
      const headers = { "Content-Type": "application/json" }
      if (token) headers["Authorization"] = `Bearer ${token}`

      const apiUrl = getApiUrl()
      const res = await fetch(`${apiUrl}/submitGrievance`, {
        method: "POST",
        headers,
        body: JSON.stringify(reqBody),
      })

      let data
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await res.json()
      } else {
        throw new Error("Unable to contact backend server. Verify the server is running.")
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit grievance")
      }

      setGrievanceId(data.grievanceId)
      setStatus("success")
      formRef.current.reset()

      // Keep user info filled
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        const user = JSON.parse(savedUser)
        formRef.current.fname.value = user.username
        formRef.current.email.value = user.email
      }
    } catch (err) {
      setStatus("failure")
      setErrorMessage(err.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />

      <div className="flex flex-col items-center py-12">

        {/* ── Success Banner with Grievance ID ─────────────────────── */}
        {status === "success" && grievanceId && (
          <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-emerald-700/95 border border-emerald-500 rounded-2xl shadow-2xl backdrop-blur-md p-5 animate-slide-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✅</span>
              <span className="font-bold text-white text-lg">Grievance Lodged!</span>
            </div>
            <p className="text-emerald-200 text-sm mb-3">
              Save your Grievance ID to track the status later.
            </p>
            <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-600/50 rounded-lg px-3 py-2">
              <code className="text-emerald-300 text-xs font-mono flex-1 break-all">{grievanceId}</code>
              <button
                onClick={handleCopyId}
                className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-150 active:scale-95"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <button
              onClick={() => { setStatus(null); setGrievanceId(null) }}
              className="mt-3 text-emerald-300 text-xs hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── Error Banner ──────────────────────────────────────────── */}
        {status === "failure" && (
          <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-rose-700/95 border border-rose-500 rounded-2xl shadow-2xl backdrop-blur-md p-5 animate-slide-in">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">❌</span>
              <span className="font-bold text-white text-lg">Submission Failed</span>
            </div>
            <p className="text-rose-200 text-sm">{errorMessage}</p>
            <button
              onClick={() => { setStatus(null); setErrorMessage("") }}
              className="mt-3 text-rose-300 text-xs hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="w-full max-w-xl glass-card p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Submit Grievance</h1>
            <p className="text-gray-400 text-sm mt-2">Please provide clear and truthful details about your recruitment issue.</p>
          </div>

          <form ref={formRef} onSubmit={handleGrievanceSubmit} className="flex flex-col gap-5">
            <div>
              <label className="premium-label" htmlFor="fname">Full Name</label>
              <input required id="fname" name="fname" type="text" className="premium-input" placeholder="John Doe" />
            </div>

            <div>
              <label className="premium-label" htmlFor="email">Email Address</label>
              <input required id="email" name="email" type="email" className="premium-input" placeholder="john@example.com" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="premium-label" htmlFor="district">District</label>
                <select name="district" id="district" className="premium-input cursor-pointer" required>
                  <option value="Anantnag">Anantnag</option>
                  <option value="Bandipora">Bandipora</option>
                  <option value="Baramulla">Baramulla</option>
                  <option value="Budgam">Budgam</option>
                  <option value="Doda">Doda</option>
                  <option value="Ganderbal">Ganderbal</option>
                  <option value="Jammu">Jammu</option>
                  <option value="Kathua">Kathua</option>
                  <option value="Kishtwar">Kishtwar</option>
                  <option value="Kulgam">Kulgam</option>
                  <option value="Kupwara">Kupwara</option>
                  <option value="Poonch">Poonch</option>
                  <option value="Pulwama">Pulwama</option>
                  <option value="Rajouri">Rajouri</option>
                  <option value="Ramban">Ramban</option>
                  <option value="Reasi">Reasi</option>
                  <option value="Samba">Samba</option>
                  <option value="Shopian">Shopian</option>
                  <option value="Srinagar">Srinagar</option>
                  <option value="Udhampur">Udhampur</option>
                </select>
              </div>

              <div>
                <label className="premium-label" htmlFor="board">Recruiting Body</label>
                <select name="board" id="board" className="premium-input cursor-pointer" required>
                  <option value="jkssb">JKSSB</option>
                  <option value="jkpsc">JKPSC</option>
                  <option value="highCourt">High Court</option>
                  <option value="distAdmin">District Administration</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div>
              <label className="premium-label" htmlFor="post">Post Applied For</label>
              <input name="post" id="post" type="text" className="premium-input" placeholder="e.g. Junior Assistant, Patwari" />
            </div>

            <div>
              <label className="premium-label" htmlFor="issueType">Type of Issue</label>
              <select name="issueType" id="issueType" className="premium-input cursor-pointer" required>
                <option value="Unfair Means">Witnessed Unfair Means at Exam Center</option>
                <option value="Date Deferment">Date Deferment / Exam Cancellation</option>
                <option value="Pending Refund">Refund Pending for Cancelled Exam</option>
                <option value="Delayed Exam">Delayed Exam / Incapability to Conduct on Time</option>
                <option value="Result Delay">Result / Selection List / Appointment Order Delay</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="premium-label" htmlFor="desc">Description of Grievance</label>
              <textarea name="desc" id="desc" rows={4} className="premium-input resize-none" placeholder="Provide detailed description of the issue..."></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="spinner-sm"></span>
                  <span>Submitting Grievance...</span>
                </>
              ) : (
                <span>Submit Grievance</span>
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SubmitGrievance
