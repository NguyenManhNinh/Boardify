import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material'
import { registerApi, loginApi } from '~/apis'
import { useAuth } from '~/customHooks/useAuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import TrelloLeftSvg from '~/assets/trello-left.4f52d13c.svg?url'
import TrelloRightSvg from '~/assets/trello-right.e6e102c7.svg?url'
import { getRecentBoards } from '~/utilities/recentBoards'
import { getUserBoards } from '~/services/boardsService'
import { API_ROOT } from '~/utilities/constans'

export const AuthPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, user } = useAuth()

  // Redirect if already logged in
  // Redirect if already logged in
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (user) {
        const recentBoards = getRecentBoards()
        if (recentBoards.length > 0) {
          navigate(`/boards/${recentBoards[0]._id}`)
        } else {
          // Try to fetch from API
          try {
            const userBoards = await getUserBoards()
            const boards = userBoards?.data || userBoards?.boards || userBoards || []
            if (Array.isArray(boards) && boards.length > 0) {
              navigate(`/boards/${boards[0]._id}`)
            } else {
              navigate('/boards')
            }
          } catch (error) {
            console.error('Failed to fetch boards for redirect:', error)
            navigate('/boards')
          }
        }
      }
    }
    checkAndRedirect()
  }, [user, navigate])

  const [tabValue, setTabValue] = useState(0) // 0: Login, 1: SignUp

  // Check for tab query param
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === '1') {
      setTabValue(1)
    }
  }, [searchParams])

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // SignUp state
  const [signupEmail, setSignupEmail] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupDisplayName, setSignupDisplayName] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  const [signupError, setSignupError] = useState('')
  const [errors, setErrors] = useState({})

  const validateSignUp = () => {
    const newErrors = {}

    // Validate Email
    if (!signupEmail) {
      newErrors.email = 'Vui lòng nhập email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      newErrors.email = 'Email không hợp lệ'
    }

    // Validate Username
    if (!signupUsername) {
      newErrors.username = 'Vui lòng nhập username'
    } else if (signupUsername.length < 3) {
      newErrors.username = 'Username phải có ít nhất 3 ký tự'
    }

    // Validate Display Name
    if (!signupDisplayName) {
      newErrors.displayName = 'Vui lòng nhập tên hiển thị'
    }

    // Validate Password
    if (!signupPassword) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    } else if (signupPassword.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    // Validate Confirm Password
    if (signupConfirm !== signupPassword) {
      newErrors.confirm = 'Mật khẩu nhập lại không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')

    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      setLoginError('Invalid email format')
      return
    }

    setLoading(true)
    try {
      const response = await loginApi({
        email: loginEmail.trim(),
        password: loginPassword.trim()
      })
      console.log('Login response:', response)

      const { data } = response
      login(data, data.token)
      showSnackbar('Login successful! Welcome back.', 'success')

      // Redirect after brief delay
      setTimeout(async () => {
        // Check for redirect URL from invitation
        const redirectUrl = searchParams.get('redirect')
        if (redirectUrl) {
          window.location.href = redirectUrl  // Full reload to trigger AcceptInvite
        } else {
          const recentBoards = getRecentBoards()
          if (recentBoards.length > 0) {
            navigate(`/boards/${recentBoards[0]._id}`)
          } else {
            // Try to fetch from API
            try {
              const userBoards = await getUserBoards()
              // Handle response structure: { data: [...] } or { boards: [...] } or [...]
              const boards = userBoards?.data || userBoards?.boards || userBoards || []
              if (Array.isArray(boards) && boards.length > 0) {
                navigate(`/boards/${boards[0]._id}`)
              } else {
                navigate('/boards')
              }
            } catch (error) {
              console.error('Failed to fetch boards for redirect:', error)
              navigate('/boards')
            }
          }
        }
      }, 1500)
    } catch (error) {
      console.error('Login error:', error)
      setLoginError(error.response?.data?.message || 'Login failed. Please try again.')
      showSnackbar(error.response?.data?.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  // SignUp handler
  const handleSignUp = async (e) => {
    e.preventDefault()
    setSignupError('')

    if (!validateSignUp()) return

    setLoading(true)
    try {
      const response = await registerApi({
        email: signupEmail.trim(),
        username: signupUsername.trim(),
        displayName: signupDisplayName.trim() || signupUsername.trim(),
        password: signupPassword
      })
      console.log('Register response:', response)

      const { data } = response
      login(data, data.token)
      showSnackbar('Account created successfully! Welcome.', 'success')


      // Redirect after brief delay
      setTimeout(() => {
        // Check for redirect URL from invitation
        const redirectUrl = searchParams.get('redirect')
        if (redirectUrl) {
          window.location.href = redirectUrl  // Full reload to trigger AcceptInvite
        } else {
          const recentBoards = getRecentBoards()
          if (recentBoards.length > 0) {
            navigate(`/boards/${recentBoards[0]._id}`)
          } else {
            navigate('/boards')
          }
        }
      }, 1500)
    } catch (error) {
      console.error('Register error:', error)
      setSignupError(error.response?.data?.message || 'Registration failed. Please try again.')
      showSnackbar(error.response?.data?.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    // OUTER wrapper: center the content on the page
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none'
        }
      }}
    >
      {/* Decorative Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          transform: 'rotate(45deg)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none'
        }}
      />

      {/* CONTENT WRAPPER (max width) */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 1400,
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, md: 4 },
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* LEFT: Illustration */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            minHeight: '500px',
            opacity: 0.9,
            filter: 'blur(0.5px)',
            transition: 'opacity 0.3s ease',
            '&:hover': { opacity: 1, filter: 'none' }
          }}
        >
          <Box
            component="img"
            src={TrelloLeftSvg}
            sx={{
              width: '100%',
              maxWidth: '350px',
              objectFit: 'contain'
            }}
          />
        </Box>

        {/* CENTER: form column */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '0 0 520px' },
            maxWidth: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Card
            sx={{
              width: '100%',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
              zIndex: 2
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 3,
                textAlign: 'center'
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Boardify
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Nơi quản lý,công việc của bạn
              </Typography>
            </Box>

            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={(e, value) => setTabValue(value)}
              variant="fullWidth"
              sx={{
                borderBottom: '1px solid #e0e0e0',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  py: 2,
                  color: '#999'
                },
                '& .MuiTab-root.Mui-selected': {
                  color: '#667eea'
                },
                '& .MuiTabIndicator-root': {
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  height: 3
                }
              }}
            >
              <Tab label="Đăng nhập" />
              <Tab label="Đăng ký" />
            </Tabs>

            {/* Content */}
            <Box sx={{ p: 4 }}>
              {/* Login Tab */}
              {tabValue === 0 && (
                <form onSubmit={handleLogin}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: '600', color: '#333' }}>
                    Chào mừng bạn trở lại 👋
                  </Typography>

                  {loginError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {loginError}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    margin="normal"
                    placeholder="user@gmail.com"
                    InputLabelProps={{
                      shrink: true
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    margin="normal"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
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
                        borderRadius: '10px',
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2, fontSize: '14px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      Nhớ tôi nhé
                    </label>
                    <Tooltip title="" arrow>
                      <Link onClick={() => navigate('/auth/forgot-password')} sx={{ textDecoration: 'none', color: '#667eea', '&:hover': { textDecoration: 'underline' }, cursor: 'pointer' }}>
                        Quên mật khẩu?
                      </Link>
                    </Tooltip>
                  </Box>

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      py: 1.2,
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)' },
                      '&:disabled': { background: '#ccc' }
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        <span>Đang đăng nhập...</span>
                      </Box>
                    ) : 'Đăng nhập'}
                  </Button>

                  <Divider sx={{ my: 2, color: '#ddd' }}>OR</Divider>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<GoogleIcon />}
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        color: '#333',
                        borderColor: '#ddd',
                        bgcolor: 'white',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: '#ccc',
                          bgcolor: '#f5f5f5',
                          transform: 'translateY(-1px)'
                        }
                      }}
                      onClick={() => window.location.href = `${API_ROOT}/v1/auth/google`}
                    >
                      Google
                    </Button>
                  </Box>

                  <Typography sx={{ textAlign: 'center', mt: 3, color: '#666', fontSize: '14px' }}>
                    Không có tài khoản?{' '}
                    <Link onClick={() => setTabValue(1)} sx={{ color: '#667eea', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      Đăng ký ngay
                    </Link>
                  </Typography>
                </form>
              )}

              {/* SignUp Tab */}
              {tabValue === 1 && (
                <form onSubmit={handleSignUp}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: '600', color: '#333' }}>
                    Bắt đầu với Boardify
                  </Typography>

                  {signupError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {signupError}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: '' })
                    }}
                    margin="normal"
                    placeholder="user@gamil.com"
                    helperText={
                      errors.email || 'Dùng email bạn thường xuyên sử dụng để có thể khôi phục mật khẩu.'}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }}
                  />

                  <TextField
                    fullWidth
                    label="Username"
                    value={signupUsername}
                    onChange={(e) => {
                      setSignupUsername(e.target.value)
                      if (errors.username) setErrors({ ...errors, username: '' })
                    }}
                    margin="normal"
                    placeholder="Tên của bạn"
                    error={!!errors.username}
                    helperText={errors.username || 'Ít nhất 7 ký tự'}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }}
                  />

                  <TextField
                    fullWidth
                    label="Display Name"
                    value={signupDisplayName}
                    onChange={(e) => {
                      setSignupDisplayName(e.target.value)
                      if (errors.displayName) setErrors({ ...errors, displayName: '' })
                    }}
                    margin="normal"
                    placeholder="Biệt danh của bạn"
                    error={!!errors.displayName}
                    helperText={errors.displayName}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: '' })
                    }}
                    margin="normal"
                    placeholder="••••••••"
                    error={!!errors.password}
                    helperText={errors.password || 'Ít nhất 6 ký tự'}
                    autoComplete="new-password"
                    InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }}
                  />

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirm ? 'text' : 'password'}
                    value={signupConfirm}
                    onChange={(e) => {
                      setSignupConfirm(e.target.value)
                      if (errors.confirm) setErrors({ ...errors, confirm: '' })
                    }}
                    margin="normal"
                    placeholder="••••••••"
                    error={!!errors.confirm}
                    helperText={errors.confirm}
                    autoComplete="new-password"
                    InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">{showConfirm ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', '&:hover fieldset': { borderColor: '#667eea' }, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }}
                  />

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      py: 1.2,
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)' },
                      '&:disabled': { background: '#ccc' }
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        <span>Đang đăng ký...</span>
                      </Box>
                    ) : 'Đăng ký'}
                  </Button>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                  </Box>
                  <Typography sx={{ textAlign: 'center', mt: 3, color: '#666', fontSize: '14px' }}>
                    Đã có tài khoản?{' '}
                    <Link onClick={() => setTabValue(0)} sx={{ color: '#667eea', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      Đăng nhập
                    </Link>
                  </Typography>
                </form>
              )}
            </Box>
          </Card>
        </Box>

        {/* RIGHT: Illustration */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', lg: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '500px',
            opacity: 0.9,
            filter: 'blur(0.5px)',
            transition: 'opacity 0.3s ease',
            '&:hover': { opacity: 1, filter: 'none' }
          }}
        >
          <Box
            component="img"
            src={TrelloRightSvg}
            sx={{
              width: '100%',
              maxWidth: '350px',
              objectFit: 'contain'
            }}
          />
        </Box>
      </Box >

      {/* Snackbar Notification */}
      < Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar >
    </Box >
  )
}
