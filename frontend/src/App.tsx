
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import Dashboard from "@/pages/Dashboard"
import CrewManagement from "@/pages/CrewManagement"
import ZoneManagement from "@/pages/ZoneManagement"
import DailyLogEntry from "@/pages/DailyLogEntry"
import AllLogEntries from "@/pages/AllLogEntries"
import LoginPage from "@/pages/LoginPage"
import UserManagement from "@/pages/UserManagement"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/AuthContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { UserRole } from "@/types"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/crews" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CrewManagement />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/zones" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ZoneManagement />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/daily-log" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DailyLogEntry />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/all-logs" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AllLogEntries />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/users" element={
              <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <DashboardLayout>
                  <UserManagement />
                </DashboardLayout>
              </ProtectedRoute>
            } />

          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
