import React, { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

function Navbar() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState("dark")
  const navigate = useNavigate()
  const currentPath = window.location.pathname

  // Check auth session
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (err) {
        console.error("Error parsing user from storage:", err)
      }
    }
  }, [])

  // Initialize and apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"
    setTheme(savedTheme)
    if (savedTheme === "light") {
      document.body.classList.add("light")
    } else {
      document.body.classList.remove("light")
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    localStorage.setItem("theme", nextTheme)
    if (nextTheme === "light") {
      document.body.classList.add("light")
    } else {
      document.body.classList.remove("light")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/")
  }

  // Active navigation styles helper
  const getNavClass = (path) => {
    const baseClass = "cursor-pointer font-semibold transition-all px-3.5 py-2 rounded-lg text-sm border flex items-center "
    const isActive = currentPath === path
    if (isActive) {
      return baseClass + "bg-blue-600/10 text-blue-500 border-blue-500/20 shadow-sm shadow-blue-500/5"
    }
    return baseClass + "text-gray-300 hover:text-blue-400 border-transparent hover:bg-white/5"
  }

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-center py-5 border-b border-white/10 gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          <a href="/">JK Grievance Tracker</a>
        </h1>
        <nav className="flex items-center gap-4">
          <ul className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className={getNavClass("/")}>Home</a>
            </li>
            <li>
              <a href="/submitGrievance" className={getNavClass("/submitGrievance")}>Submit Grievance</a>
            </li>
            <li>
              <a href="/trackStatus" className={getNavClass("/trackStatus")}>Track Status</a>
            </li>
            {user ? (
              <li className="flex items-center gap-3 ml-2">
                <span className="text-gray-400 text-xs bg-slate-800/80 px-3 py-2 rounded-lg border border-white/5 font-mono">
                  👤 {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer text-xs bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-lg px-3 py-2 hover:bg-rose-600 hover:text-white transition-all active:scale-95 font-semibold"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="ml-2">
                <a 
                  href="/login" 
                  className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all active:scale-95 border flex items-center
                    ${currentPath === "/login" || currentPath === "/register"
                      ? "bg-blue-600/10 text-blue-500 border-blue-500/20"
                      : "bg-blue-600 hover:bg-blue-500 text-white border-blue-600 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
                    }`}
                >
                  Register / Login
                </a>
              </li>
            )}
          </ul>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-300 hover:text-white cursor-pointer active:scale-90"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              // Sun icon (for switching to light mode)
              <svg className="w-5 h-5 fill-amber-400" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464-4.95a1 1 0 111.414 1.414L14.25 5.75a1 1 0 01-1.414-1.414l.707-.707zm-9.9 9.9a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zm9.9 0a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707zm-9.9-9.9a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM16 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm10 5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" />
              </svg>
            ) : (
              // Moon icon (for switching to dark mode)
              <svg className="w-5 h-5 fill-indigo-400" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}

export default Navbar
