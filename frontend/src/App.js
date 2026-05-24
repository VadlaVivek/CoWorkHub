import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import Login from "./pages/Login/Login"
import WorkspaceList from "./pages/WorkspaceList/WorkspaceList"
import ReservationPage from "./pages/ReservationPage/ReservationPage"
import Confirmation from "./pages/Confirmation/Confirmation"
import StaffDashboard from "./pages/StaffDashboard/StaffDashboard"
import AnalyticsDashboard from "./pages/AnalyticsDashboard/AnalyticsDashboard"
import WorkspaceManagement from "./pages/WorkspaceManagement/WorkspaceManagement"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <WorkspaceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reserve"
          element={
            <ProtectedRoute
              roles={["member"]}
            >
              <ReservationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations"
          element={
            <ProtectedRoute
              roles={["member"]}
            >
              <Confirmation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute
              roles={["staff","admin"]}
            >
              <StaffDashboard/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute
              roles={["admin"]}
            >
              <AnalyticsDashboard/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage"
          element={
            <ProtectedRoute
              roles={["admin"]}
            >
              <WorkspaceManagement/>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App