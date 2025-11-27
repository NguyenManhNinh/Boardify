import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { CircularProgress, Box } from '@mui/material'
import { useAuth } from './customHooks/useAuthContext'
import { toast } from 'react-toastify'
import { API_ROOT } from './utilities/constans'

// Lazy load components
const Board = lazy(() => import("./pages/Boards/_id"))
const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage").then(module => ({ default: module.ProfilePage })))
const BoardsList = lazy(() => import("./pages/Boards/BoardsList").then(module => ({ default: module.BoardsList })))
const AcceptInvite = lazy(() => import("./pages/AcceptInvite/AcceptInvite"))
const AuthPage = lazy(() => import('./components/Auth/AuthPage').then(module => ({ default: module.AuthPage })))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'))
const AuthCallback = lazy(() => import('./pages/Auth/AuthCallback'))

// Loading Component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress />
  </Box>
)

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingFallback />
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

function App() {
  const { token, updateUser } = useAuth()

  // Global OAuth callback handler - runs on all pages
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const googleDriveStatus = urlParams.get('google_drive')

      if (googleDriveStatus === 'connected' && token) {
        try {
          console.log('🔍 OAuth callback detected, refreshing user profile...')
          const response = await fetch(`${API_ROOT}/v1/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const { data } = await response.json()
            console.log('✅ User profile refreshed:', data)
            updateUser(data)
            toast.success('Kết nối Google Drive thành công!')
          }

          // Clean up URL params
          window.history.replaceState({}, '', window.location.pathname)
        } catch (error) {
          console.error('❌ Error refreshing user profile:', error)
        }
      } else if (googleDriveStatus === 'error') {
        toast.error('Lỗi khi kết nối Google Drive')
        window.history.replaceState({}, '', window.location.pathname)
      }
    }

    handleOAuthCallback()
  }, [token, updateUser])

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* Accept board invitation */}
        <Route path="/invite/accept" element={<AcceptInvite />} />

        {/* Boards list */}
        <Route
          path="/boards"
          element={
            <ProtectedRoute>
              <BoardsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/boards/:boardId"
          element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
