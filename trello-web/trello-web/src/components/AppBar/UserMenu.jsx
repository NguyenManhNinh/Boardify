import { useState } from 'react'
import {
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Box,
  Typography,
  Tooltip,
  CircularProgress
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/customHooks/useAuthContext'
import { logoutApi } from '~/apis'
import { ShortcutsModal } from '~/components/ShortcutsModal/ShortcutsModal'

export const UserMenu = () => {
  const navigate = useNavigate()
  const { user, token, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [openShortcuts, setOpenShortcuts] = useState(false)

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    navigate('/profile')
    handleCloseMenu()
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutApi(token)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
      handleCloseMenu()
      setLoggingOut(false)
    }
  }

  if (!user) {
    return <CircularProgress size={24} />
  }

  const getInitials = () => {
    const name = user?.displayName || user?.username || 'U'
    return String(name)
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <Tooltip title={user.displayName || user.username}>
        <Avatar
          onClick={handleOpenMenu}
          sx={{
            cursor: 'pointer',
            width: 36,
            height: 36,
            bgcolor: '#1565c0',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            '&:hover': {
              opacity: 0.8
            }
          }}
          src={user.avatar}
        >
          {!user.avatar && getInitials()}
        </Avatar>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {user.displayName || user.username}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user.email}
            </Typography>
          </Box>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleProfileClick}>
          <Typography variant="body2">Hồ sơ</Typography>
        </MenuItem>

        <MenuItem onClick={() => {
          handleCloseMenu()
          setOpenShortcuts(true)
        }}>
          <Typography variant="body2">Phím tắt</Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} disabled={loggingOut}>
          <LogoutIcon sx={{ mr: 1, fontSize: 'small' }} />
          <Typography variant="body2">{loggingOut ? 'Logging out...' : 'Đăng xuất'}</Typography>
        </MenuItem>
      </Menu>
      <ShortcutsModal open={openShortcuts} onClose={() => setOpenShortcuts(false)} />
    </>
  )
}
