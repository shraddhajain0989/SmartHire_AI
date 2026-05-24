import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import InterviewPage from './pages/InterviewPage'
import CodingPage from './pages/CodingPage'
import ResumePage from './pages/ResumePage'
import AnalyticsPage from './pages/AnalyticsPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="mx-auto max-w-7xl px-4 py-6"
        >
          <Routes>
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
            <Route path="/coding" element={<ProtectedRoute><CodingPage /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
