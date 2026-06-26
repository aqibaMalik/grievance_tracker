import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
import { getApiUrl } from "../utils/api"

function Register() {
  const [status, setStatus] = useState(null) // 'success', 'failure'
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const formRef = useRef()
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    
    const username = formRef.current.username.value.trim()
    const email = formRef.current.email.value.trim()
    const password = formRef.current.password.value
    const confirmPassword = formRef.current.confirmPassword.value

    if (password !== confirmPassword) {
      setStatus("failure")
      setErrorMessage("Passwords do not match")
      return
    }

    setLoading(true)
    setStatus(null)
    setErrorMessage("")

    try {
      const apiUrl = getApiUrl()
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      let data
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await res.json()
      } else {
        throw new Error("Unable to contact backend server. Verify the server is running.")
      }

      if (!res.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Save token and user details to localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setStatus("success")
      setTimeout(() => {
        navigate("/")
      }, 1500)
    } catch (err) {
      setStatus("failure")
      setErrorMessage(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />

      <div className="flex flex-col items-center py-16 min-h-screen">
        <div className="w-full max-w-md glass-card p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
            <p className="text-gray-400 text-sm mt-2">Register to track and manage your exam grievances.</p>
          </div>

          <form ref={formRef} onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="premium-label" htmlFor="username">Username</label>
              <input
                required
                id="username"
                name="username"
                type="text"
                placeholder="aaqib123"
                className="premium-input"
              />
            </div>

            <div>
              <label className="premium-label" htmlFor="email">Email Address</label>
              <input
                required
                id="email"
                name="email"
                type="email"
                placeholder="aaqib@example.com"
                className="premium-input"
              />
            </div>

            <div>
              <label className="premium-label" htmlFor="password">Password</label>
              <input
                required
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="premium-input"
              />
            </div>

            <div>
              <label className="premium-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                required
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="premium-input"
              />
            </div>

            {status === "failure" && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg p-3 text-center text-sm">
                ⚠️ {errorMessage}
              </div>
            )}

            {status === "success" && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-3 text-center text-sm font-semibold">
                🎉 Account created! Redirecting...
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="spinner-sm"></span>
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline font-medium">
              Log In
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Register
