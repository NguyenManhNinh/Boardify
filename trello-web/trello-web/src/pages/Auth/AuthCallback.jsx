
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '~/customHooks/useAuthContext'
import { CircularProgress, Box, Typography } from '@mui/material'
import { getProfileApi } from '~/apis'

function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      // Fetch user profile with the token
      getProfileApi(token)
        .then((userData) => {
          // Login with the fetched user data and token
          login(userData.data || userData, token)
          navigate('/boards')
        })
        .catch((error) => {
          console.error('Failed to fetch profile:', error)
          // navigate('/auth') // Comment out redirect to see error
          alert(`Login Failed: ${error.message}`) // Simple alert for now
        })
    } else {
      // navigate('/auth')
      console.error('No token found in URL')
    }
  }, [searchParams, navigate, login])

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
      <Typography sx={{ mt: 2 }}>Đang đăng nhập...</Typography>
    </Box>
  )
}

export default AuthCallback
