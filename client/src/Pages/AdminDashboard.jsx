import React, { useState, useEffect, useCallback } from "react"
import { getApiUrl } from "../utils/api"

const STATUS_OPTIONS = ["Pending", "Under Review", "Resolved", "Rejected"]

function statusBadgeClass(status) {
  switch (status) {
    case "Resolved":    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    case "Under Review": return "bg-blue-500/15 text-blue-400 border-blue-500/30"
    case "Rejected":    return "bg-rose-500/15 text-rose-400 border-rose-500/30"
    default:            return "bg-amber-500/15 text-amber-400 border-amber-500/30"
  }
}

const issueTypeMap = {
  unfairmeans:   "Unfair Means",
  dateDefer:     "Date Deferment",
  refundPending: "Pending Refund",
  delayedExam:   "Delayed Exam",
  resultDelay:   "Result Delay",
}

function AdminDashboard() {
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem("adminToken") || "")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loggingIn, setLoggingIn] = useState(false)

  const [grievances, setGrievances] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState("")

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [toast, setToast] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const apiUrl = getApiUrl()

  function showToast(type, msg) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleAdminLogin(e) {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError("")
    try {
      const res = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword }),
      })
      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server not reachable. Make sure backend is running.")
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Login failed")
      sessionStorage.setItem("adminToken", data.token)
      setAdminToken(data.token)
    } catch (err) {
      setLoginError(err.message)
    } finally {
      setLoggingIn(false)
    }
  }

  const fetchGrievances = useCallback(async () => {
    if (!adminToken) return
    setLoading(true)
    setFetchError("")
    try {
      const res = await fetch(`${apiUrl}/api/admin/grievances?page=${page}&limit=15`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error — is the backend running?")
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to load grievances")
      setGrievances(data.grievances)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setLoading(false)
    }
  }, [adminToken, page, apiUrl])

  useEffect(() => { fetchGrievances() }, [fetchGrievances])

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id)
    try {
      const res = await fetch(`${apiUrl}/api/admin/grievances/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Update failed")
      setGrievances(prev => prev.map(g => g._id === id ? { ...g, status: newStatus } : g))
      showToast("success", `Status updated to "${newStatus}"`)
    } catch (err) {
      showToast("error", err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(id) {
    setConfirmDelete(null)
    try {
      const res = await fetch(`${apiUrl}/api/admin/grievances/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Delete failed")
      setGrievances(prev => prev.filter(g => g._id !== id))
      setTotal(t => t - 1)
      showToast("success", "Grievance deleted successfully")
    } catch (err) {
      showToast("error", err.message)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("adminToken")
    setAdminToken("")
    setGrievances([])
  }

  const filtered = grievances.filter(g => {
    const q = search.toLowerCase()
    return (
      g.fname?.toLowerCase().includes(q) ||
      g.email?.toLowerCase().includes(q) ||
      g.district?.toLowerCase().includes(q) ||
      g._id?.toLowerCase().includes(q)
    )
  })

  const statCards = [
    { label: "Total Grievances", value: total,                                                          color: "blue" },
    { label: "Pending",          value: grievances.filter(g => g.status === "Pending").length,          color: "amber" },
    { label: "Under Review",     value: grievances.filter(g => g.status === "Under Review").length,     color: "indigo" },
    { label: "Resolved",         value: grievances.filter(g => g.status === "Resolved").length,         color: "emerald" },
  ]

  /* ── LOGIN WALL ─────────────────────────────────────────────────────────── */
  if (!adminToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md glass-card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-2">Restricted access. Enter admin password to continue.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <div>
              <label className="premium-label" htmlFor="adminPass">Admin Password</label>
              <input
                id="adminPass"
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="premium-input"
                placeholder="Enter admin password..."
              />
            </div>
            {loginError && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2.5 text-rose-400 text-sm">
                ❌ {loginError}
              </div>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingIn
                ? <><span className="spinner-sm"></span> Authenticating...</>
                : "Login to Admin"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-6">
            Default password: <code className="text-gray-400">admin@grievance2024</code>
          </p>
          <p className="text-center mt-3">
            <a href="/" className="text-blue-400 hover:text-blue-300 text-xs transition-colors">← Back to Home</a>
          </p>
        </div>
      </div>
    )
  }

  /* ── DASHBOARD ──────────────────────────────────────────────────────────── */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-medium text-sm border backdrop-blur-md flex items-center gap-2 ${
          toast.type === "success" ? "bg-emerald-700/95 border-emerald-500" : "bg-rose-700/95 border-rose-500"
        }`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Confirm Deletion</h3>
            <p className="text-gray-400 text-sm mb-5">
              This will permanently remove the grievance. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-lg font-semibold text-sm transition-all"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">🛡️ Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor, manage, and resolve grievances</p>
        </div>
        <div className="flex gap-3">
          <a href="/" className="text-sm text-gray-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-white/10 transition-all">
            ← Home
          </a>
          <button
            onClick={handleLogout}
            className="text-sm text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 px-4 py-2 rounded-lg border border-rose-500/30 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 flex flex-col items-center text-center">
            <span className={`text-3xl font-extrabold text-${color}-400`}>{value}</span>
            <span className="text-gray-400 text-xs mt-1">{label}</span>
          </div>
        ))}
      </div>

      {/* Search + Refresh */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, district, or ID..."
          className="premium-input flex-1"
        />
        <button
          onClick={fetchGrievances}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shrink-0"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="spinner"></div>
          <p className="text-gray-400 text-sm animate-pulse">Loading grievances...</p>
        </div>
      ) : fetchError ? (
        <div className="text-center py-16">
          <p className="text-rose-400 font-semibold text-lg">⚠️ {fetchError}</p>
          <button onClick={fetchGrievances} className="mt-4 text-sm text-blue-400 hover:text-white underline transition-colors">
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No grievances found.</div>
      ) : (
        <>
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800/60 text-gray-300 text-left">
                    <th className="px-4 py-3.5 font-semibold">Name / Email</th>
                    <th className="px-4 py-3.5 font-semibold">District</th>
                    <th className="px-4 py-3.5 font-semibold">Issue Type</th>
                    <th className="px-4 py-3.5 font-semibold">Date</th>
                    <th className="px-4 py-3.5 font-semibold">Status</th>
                    <th className="px-4 py-3.5 font-semibold text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map(g => (
                    <tr key={g._id} className="hover:bg-white/[0.025] transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-white">{g.fname}</p>
                        <p className="text-gray-500 text-xs">{g.email}</p>
                        <p className="text-gray-600 text-[10px] font-mono mt-0.5 truncate max-w-[140px]" title={g._id}>{g._id}</p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-300">{g.district}</td>
                      <td className="px-4 py-3.5 text-blue-400 font-medium">
                        {issueTypeMap[g.issueType] || g.issueType || "Others"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {g.createdAt
                          ? new Date(g.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="relative inline-block">
                          <select
                            value={g.status || "Pending"}
                            disabled={updatingId === g._id}
                            onChange={e => handleStatusChange(g._id, e.target.value)}
                            className={`text-xs font-semibold border rounded-full px-3 py-1.5 cursor-pointer focus:outline-none transition-all ${statusBadgeClass(g.status || "Pending")} disabled:opacity-60`}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
                            ))}
                          </select>
                          {updatingId === g._id && (
                            <span className="absolute -right-5 top-1/2 -translate-y-1/2">
                              <span className="spinner-sm"></span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => setConfirmDelete(g._id)}
                          className="text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-white/10 disabled:opacity-40 transition-all"
              >
                ← Prev
              </button>
              <span className="text-gray-400 text-sm">Page {page} of {pages}</span>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-white/10 disabled:opacity-40 transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminDashboard
