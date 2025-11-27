import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  InputAdornment,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import EditNoteIcon from '@mui/icons-material/EditNote'


export const ProfileInfoForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    bio: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [isDirty, setIsDirty] = useState(false)

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      setFormData({
        displayName: initialData.displayName || initialData.name || '',
        email: initialData.email || '',
        bio: initialData.bio || '',
        phone: initialData.phone || ''
      })
    }
  }, [initialData])

  // Handle unsaved changes warning (browser refresh/close)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const validate = (data) => {
    const newErrors = {}

    // Name validation
    if (!data.displayName || data.displayName.length < 2) {
      newErrors.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự'
    } else if (data.displayName.length > 50) {
      newErrors.displayName = 'Tên hiển thị không được quá 50 ký tự'
    }

    // Phone validation (Vietnam format or simple digit check)
    if (data.phone && !/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(data.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }

    // Bio validation
    if (data.bio && data.bio.length > 200) {
      newErrors.bio = 'Giới thiệu không được quá 200 ký tự'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const newData = { ...formData, [name]: value }
    setFormData(newData)
    setIsDirty(true)

    // Real-time validation
    if (errors[name]) {
      validate(newData)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate(formData)) {
      onSubmit(formData)
      setIsDirty(false)
    }
  }

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('Bạn có chắc muốn hủy bỏ các thay đổi?')) {
        setFormData({
          displayName: initialData.displayName || initialData.name || '',
          email: initialData.email || '',
          bio: initialData.bio || '',
          phone: initialData.phone || ''
        })
        setErrors({})
        setIsDirty(false)
      }
    } else {
      // Just reset if no changes (though button might be disabled)
      setFormData({
        displayName: initialData.displayName || initialData.name || '',
        email: initialData.email || '',
        bio: initialData.bio || '',
        phone: initialData.phone || ''
      })
    }
  }

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
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'grid', gap: 3 }}>
        {/* Section 1: Personal Info */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
            Thông tin cá nhân
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên hiển thị"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                error={!!errors.displayName}
                helperText={errors.displayName || 'Tên này sẽ hiển thị trong bảng và bình luận.'}
                variant="outlined"
                sx={textFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone || 'Dùng để liên hệ khi cần hỗ trợ (không bắt buộc).'}
                variant="outlined"
                sx={textFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Section 2: Account Info */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
            Thông tin tài khoản
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                disabled
                helperText="Email đăng ký tài khoản, không thể thay đổi từ đây."
                variant="outlined"
                sx={{
                  ...textFieldStyle,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#F4F5F7'),
                    '&:hover': { bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#F4F5F7') }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giới thiệu"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                error={!!errors.bio}
                helperText={errors.bio || `${formData.bio.length}/500 ký tự`}
                variant="outlined"
                multiline
                rows={4}
                placeholder="Hãy điền sở thích,công việc của bạn hoặc bất cứ điều gì bạn muốn chia sẻ."
                sx={textFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <EditNoteIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={!isDirty || loading}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
              borderColor: 'divider',
              px: 3,
              borderRadius: '8px',
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'text.primary'
              }
            }}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={loading || !isDirty || Object.keys(errors).length > 0}
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
              '&:disabled': {
                bgcolor: 'rgba(9, 30, 66, 0.04)',
                color: '#A5ADBA',
                boxShadow: 'none'
              }
            }}
          >
            {loading ? 'Đang lưu...' : 'Thay đổi'}
          </Button>
        </Box>
      </Box>
    </form>
  )
}
