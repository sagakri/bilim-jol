import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteHeader } from './components/SiteHeader'
import { OpportunitiesPage } from './pages/OpportunitiesPage'
import { OpportunityDetailsPage } from './pages/OpportunityDetailsPage'
import { DemoUserDataProvider } from './features/userData/DemoUserDataContext'
import { FavoritesPage } from './pages/FavoritesPage'
import { DeadlineTrackerPage } from './pages/DeadlineTrackerPage'

export default function App() {
  return (
    <DemoUserDataProvider>
      <div className="app-shell">
        <SiteHeader />
        <Routes>
          <Route path="/" element={<Navigate to="/opportunities" replace />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/dashboard/deadlines" element={<DeadlineTrackerPage />} />
          <Route path="*" element={<Navigate to="/opportunities" replace />} />
        </Routes>
        <footer className="site-footer">BilimJol <span>·</span> Твой путь к новым возможностям</footer>
      </div>
    </DemoUserDataProvider>
  )
}
