import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { RouterProvider } from "react-router-dom"
import router from "./routes"
import Navbar from "./Components/Navbar.jsx"
import Footer from "./Components/Footer.jsx"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Navbar />
    <RouterProvider router={router} />
    <Footer />
  </StrictMode>
)
