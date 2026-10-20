import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteHeader } from './components/SiteHeader'
import { OpportunitiesPage } from './pages/OpportunitiesPage'
import { OpportunityDetailsPage } from './pages/OpportunityDetailsPage'
import { DemoUserDataProvider } from './features/userData/DemoUserDataContext'
import { FavoritesPage } from './pages/FavoritesPage'
import { DeadlineTrackerPage } from './pages/DeadlineTrackerPage'
import { AuthPage } from './pages/AuthPage'
import { ProfilePage } from './pages/ProfilePage'
import { AuthProvider } from './features/auth/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <DemoUserDataProvider>
        <div className="app-shell">
          <SiteHeader />
          <Routes>
            <Route path="/" element={<Navigate to="/opportunities" replace />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/opportunities/:id" element={<OpportunityDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/dashboard/deadlines" element={<DeadlineTrackerPage />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/opportunities" replace />} />
          </Routes>
          <footer className="site-footer">BilimJol <span>·</span> Твой путь к новым возможностям</footer>
        </div>
      </DemoUserDataProvider>
    </AuthProvider>
  )
}
