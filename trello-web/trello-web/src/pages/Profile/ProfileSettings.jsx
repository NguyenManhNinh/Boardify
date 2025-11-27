import { useState } from 'react'
import { Box, Alert, Snackbar } from '@mui/material'
import { ProfileInfoForm } from './ProfileInfoForm'
import { updateSettings } from '~/services/profileService'
import { useAuth } from '~/customHooks/useAuthContext'

export const ProfileSettings = ({ user }) => {
  const { updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const handleUpdate = async (formData) => {
    setLoading(true)
    try {
      // Call API to update user settings
      const updatedUser = await updateSettings(formData)

      // Update global user context
      updateUser(updatedUser)

      setSnackbar({
        open: true,
        message: 'Cập nhật thông tin tài khoản thành công 🎉',
        severity: 'success'
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Có lỗi xảy ra khi cập nhật',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <ProfileInfoForm
        initialData={user}
        onSubmit={handleUpdate}
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
