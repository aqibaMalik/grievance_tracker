import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import SubmitGrievance from "./Pages/SubmitGrievance"
import TrackStatus from "./Pages/TrackStatus"
import Register from "./Pages/Register"
import Login from "./Pages/Login"
import AdminDashboard from "./Pages/AdminDashboard"

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/submitGrievance",
    Component: SubmitGrievance,
  },
  {
    path: "/trackStatus",
    Component: TrackStatus,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
])
export default router

