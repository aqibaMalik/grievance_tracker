import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import SubmitGrievance from "./Pages/SubmitGrievance"
import TrackStatus from "./Pages/TrackStatus"

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
])
export default router
