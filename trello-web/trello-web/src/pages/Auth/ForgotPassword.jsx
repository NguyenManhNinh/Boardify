
import { useState } from 'react'
import { Button, TextField, Typography, Alert, Box, InputAdornment } from '@mui/material'
import { forgotPasswordApi } from '~/apis'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '~/components/Auth/AuthLayout'
import { MailOutline, ArrowBack } from '@mui/icons-material'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      await forgotPasswordApi(email)
      setMessage('Nếu email hợp lệ, chúng tôi đã gửi link đặt lại mật khẩu.')
    } catch (err) {
      setMessage('Nếu email hợp lệ, chúng tôi đã gửi link đặt lại mật khẩu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
          Boardify
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          Quên mật khẩu
        </Typography>
      </Box>

      {!message ? (
        <>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
            Nhập email bạn đã đăng ký để nhận link đặt lại mật khẩu.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline sx={{ color: '#667eea' }} />
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
              disabled={loading || !email}
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
              {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
            </Button>
          </form>
        </>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
            <Typography variant="body2">
              Nếu email hợp lệ, chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
              <br />
              Vui lòng kiểm tra email,chúng tôi sẽ gửi thông báo cho bạn sớm nhất.
            </Typography>
          </Alert>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }}>{error}</Alert>}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Link to="/auth" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#667eea', fontWeight: '600' }}>
          <ArrowBack fontSize="small" /> Quay lại Đăng nhập
        </Link>
      </Box>
    </AuthLayout>
  )
}

export default ForgotPassword
