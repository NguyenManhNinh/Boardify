import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Button,
  Alert
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { acceptBoardInvitationApi } from '~/apis'
import { toast } from 'react-toastify'

function AcceptInvite() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [boardId, setBoardId] = useState(null)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const handleAcceptInvitation = async () => {
      const token = searchParams.get('token')
      const authToken = localStorage.getItem('token')

      // Check if user is logged in
      if (!authToken) {
        // Redirect to login with return URL
        const currentUrl = window.location.href
        // Default to Sign Up tab (tab=1) for new users
        navigate(`/auth?redirect=${encodeURIComponent(currentUrl)}&tab=1`)
        return
      }

      if (!token) {
        setError('Link lời mời không hợp lệ')
        setLoading(false)
        return
      }

      try {
        const response = await acceptBoardInvitationApi(token, authToken)
        setBoardId(response.boardId)
        setSuccess(true)
        toast.success(response.message || 'Đã tham gia board thành công!')
      } catch (err) {
        console.error('Error accepting invitation:', err)
        const errorMessage = err.response?.data?.message || 'Không thể chấp nhận lời mời'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    handleAcceptInvitation()
  }, [searchParams, navigate])

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [success, countdown])

  // Auto redirect to board after success
  useEffect(() => {
    if (success && boardId && countdown === 0) {
      navigate(`/boards/${boardId}`)
    }
  }, [success, boardId, countdown, navigate])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          {loading && (
            <>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6">Đang xử lý lời mời...</Typography>
            </>
          )}

          {success && (
            <>
              <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                🎉 Tham gia thành công!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Bạn đã được thêm vào board.
              </Typography>
              <Typography variant="body2" color="primary" sx={{ mb: 3 }}>
                Đang chuyển hướng trong {countdown} giây...
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(`/boards/${boardId}`)}
              >
                Đi đến Board ngay
              </Button>
            </>
          )}

          {error && (
            <>
              <ErrorIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h5" gutterBottom color="error">
                Không thể tham gia
              </Typography>
              <Alert severity="error" sx={{ mt: 2, mb: 3, textAlign: 'left' }}>
                {error}
              </Alert>
              <Button
                variant="outlined"
                onClick={() => navigate('/boards')}
              >
                Quay lại trang chủ
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default AcceptInvite
