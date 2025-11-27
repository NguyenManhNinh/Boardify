import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Chip,
  Tooltip
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import SaveIcon from '@mui/icons-material/Save'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import PhonelinkLockIcon from '@mui/icons-material/PhonelinkLock'
import HistoryIcon from '@mui/icons-material/History'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export const ProfileSecurity = ({ onChangePassword, loading }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'newPassword') {
      calculateStrength(value)
    }
  }

  const calculateStrength = (password) => {
    let strength = 0
    if (password.length >= 6) strength += 1
    if (password.length >= 10) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    setPasswordStrength(strength)
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'error'
    if (passwordStrength <= 3) return 'warning'
    return 'success'
  }

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return 'Yếu'
    if (passwordStrength <= 3) return 'Trung bình'
    return 'Mạnh'
  }

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' })
      return
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
      return
    }

    try {
      await onChangePassword(formData.oldPassword, formData.newPassword)
      setMessage({ type: 'success', text: 'Mật khẩu đã được cập nhật thành công!' })
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordStrength(0)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Có lỗi xảy ra khi đổi mật khẩu' })
    }
  }

  // Custom style for TextFields
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#FAFBFC'),
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#EBECF0')
      },
      '&.Mui-focused': {
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#fff'),
        boxShadow: '0 0 0 2px rgba(0,82,204,0.2)'
      }
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
      fontWeight: 500
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'primary.main'
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      {message.text && (
        <Alert
          severity={message.type}
          sx={{
            mb: 3,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Password Change Section */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, #FF991F 0%, #FF5630 100%)', // Orange/Red gradient for security
              }
            }}
          >
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '8px',
                  bgcolor: 'rgba(255,153,31,0.1)',
                  color: '#FF991F',
                  display: 'flex'
                }}
              >
                <LockOutlinedIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                  Thay đổi mật khẩu
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                </Typography>
              </Box>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mật khẩu hiện tại"
                    name="oldPassword"
                    type={showPasswords.old ? 'text' : 'password'}
                    value={formData.oldPassword}
                    onChange={handleChange}
                    variant="outlined"
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyOutlinedIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={showPasswords.old ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                            <IconButton
                              onClick={() => toggleShowPassword('old')}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                              aria-label="toggle password visibility"
                            >
                              {showPasswords.old ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mật khẩu mới"
                    name="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange}
                    variant="outlined"
                    helperText="Tối thiểu 6 ký tự, nên có chữ hoa, số và ký tự đặc biệt"
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={showPasswords.new ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                            <IconButton
                              onClick={() => toggleShowPassword('new')}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                              aria-label="toggle password visibility"
                            >
                              {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                  {/* Password Strength Meter */}
                  {formData.newPassword && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(passwordStrength / 5) * 100}
                          color={getStrengthColor()}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                      <Typography variant="caption" color={`${getStrengthColor()}.main`} fontWeight={600}>
                        {getStrengthLabel()}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    variant="outlined"
                    error={Boolean(formData.confirmPassword && formData.newPassword !== formData.confirmPassword)}
                    helperText={formData.confirmPassword && formData.newPassword !== formData.confirmPassword ? "Mật khẩu xác nhận không khớp" : ""}
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={showPasswords.confirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                            <IconButton
                              onClick={() => toggleShowPassword('confirm')}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                              aria-label="toggle password visibility"
                            >
                              {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1, opacity: 0.6 }} />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={loading || !formData.oldPassword || !formData.newPassword || !formData.confirmPassword || (formData.newPassword !== formData.confirmPassword)}
                    sx={{
                      bgcolor: '#0052CC',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                      py: 1,
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,82,204,0.2)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: '#0065FF',
                        boxShadow: '0 4px 12px rgba(0,82,204,0.3)',
                        transform: 'translateY(-1px)'
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'rgba(9, 30, 66, 0.04)',
                        color: '#A5ADBA'
                      }
                    }}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Additional Security Options Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Security Features Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#FAFBFC')
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                Tính năng bảo mật
              </Typography>

              <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* 2FA Item */}
                <ListItem
                  sx={{
                    px: 2,
                    py: 2,
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 2px 8px rgba(0,82,204,0.1)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PhonelinkLockIcon sx={{ color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        Xác thực hai yếu tố (2FA)
                      </Typography>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                          Thêm một lớp bảo vệ khi đăng nhập
                        </Typography>
                        <Chip label="Sắp ra mắt" size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'action.hover', color: 'text.secondary', fontWeight: 600 }} />
                      </Box>
                    }
                  />
                </ListItem>

                {/* Login Activity Item */}
                <ListItem
                  sx={{
                    px: 2,
                    py: 2,
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 2px 8px rgba(0,82,204,0.1)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <HistoryIcon sx={{ color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        Hoạt động đăng nhập
                      </Typography>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                          Xem lịch sử đăng nhập, thiết bị lạ...
                        </Typography>
                        <Chip label="Sắp ra mắt" size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'action.hover', color: 'text.secondary', fontWeight: 600 }} />
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Security Tips Card */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                gap: 2
              }}
            >
              <TipsAndUpdatesIcon sx={{ color: '#FF991F', mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="text.primary" gutterBottom>
                  Mẹo bảo mật
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  Chúng tôi khuyên bạn nên sử dụng mật khẩu mạnh, khác nhau cho từng dịch vụ và không chia sẻ cho bất kỳ ai.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
