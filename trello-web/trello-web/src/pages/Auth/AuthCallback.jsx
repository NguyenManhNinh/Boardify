
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '~/customHooks/useAuthContext'
import { CircularProgress, Box, Typography } from '@mui/material'
import { getProfileApi } from '~/apis'

function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = searchParams.get('token')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      setError(decodeURIComponent(errorParam))
      setLoading(false)
      return
    }

    if (token) {
      // Fetch user profile with the token
      getProfileApi(token)
        .then((userData) => {
          // Login with the fetched user data and token
          login(userData.data || userData, token)
          navigate('/boards')
        })
        .catch((err) => {
          console.error('Failed to fetch profile:', err)
          setError(`Login Failed: ${err.message || 'Unknown error fetching profile'}`)
          setLoading(false)
        })
    } else {
      console.error('No token found in URL')
      setError('No token received from backend. Check URL parameters.')
      setLoading(false)
    }
  }, [searchParams, navigate, login])

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <CircularProgress color="inherit" />
        <Typography sx={{ mt: 2 }}>Processing Google Login...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      p: 3
    }}>
      <Box sx={{
        bgcolor: 'white',
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        textAlign: 'center',
        maxWidth: 500
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          Login Failed
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, fontFamily: 'monospace', bgcolor: '#eee', p: 1, borderRadius: 1 }}>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please check the console (F12) for more details.
        </Typography>
        <button
          onClick={() => navigate('/auth')}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        >
          Back to Login
        </button>
      </Box>
    </Box>
  )
}

export default AuthCallback
