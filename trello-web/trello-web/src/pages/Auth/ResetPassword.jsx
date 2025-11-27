
import { useState, useEffect } from 'react'
import { Button, TextField, Typography, Alert, Box, InputAdornment, IconButton } from '@mui/material'
import { resetPasswordApi } from '~/apis'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '~/components/Auth/AuthLayout'
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material'

function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const token = new URLSearchParams(location.search).get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await resetPasswordApi(token, password)
      setMessage('Mật khẩu đã được cập nhật. Đang chuyển về trang đăng nhập...')
      setTimeout(() => navigate('/auth'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout>
        <Alert severity="error">Token không hợp lệ hoặc thiếu token.</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="outlined" onClick={() => navigate('/auth/forgot-password')}>
            Gửi lại yêu cầu
          </Button>
        </Box>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
          Boardify
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          Đặt lại mật khẩu
        </Typography>
      </Box>

      {!message ? (
        <>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
            Nhập mật khẩu mới cho tài khoản Boardify của bạn.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Mật khẩu mới *"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={!!error && error.includes('6 ký tự')}
              helperText={(!error || !error.includes('6 ký tự')) ? 'Ít nhất 6 ký tự' : error}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea' }
                }
              }}
            />
            <TextField
              label="Xác nhận mật khẩu *"
              type={showConfirm ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={!!error && error.includes('không khớp')}
              helperText={error && error.includes('không khớp') ? error : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea' }
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.2,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                '&:hover': { opacity: 0.9 }
              }}
            >
              {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </Button>
          </form>
        </>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
            {message}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/auth')} sx={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
            Đăng nhập ngay
          </Button>
        </Box>
      )}

      {error && !error.includes('6 ký tự') && !error.includes('không khớp') && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }}>{error}</Alert>
      )}
    </AuthLayout>
  )
}

export default ResetPassword
