import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button
} from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import {
  selectNotifications,
  selectUnreadCount,
  markAllAsRead,
  clearNotifications
} from '~/redux/notifications/notificationsSlice'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

function Notifications() {
  const dispatch = useDispatch()
  const notifications = useSelector(selectNotifications)
  const unreadCount = useSelector(selectUnreadCount)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    if (unreadCount > 0) {
      dispatch(markAllAsRead())
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClearAll = () => {
    dispatch(clearNotifications())
    handleClose()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'CREATE_CARD': return '📝'
      case 'CREATE_COLUMN': return '📋'
      case 'UPDATE_DEADLINE': return '⏰'
      case 'ADD_MEMBER': return '👤'
      default: return '🔔'
    }
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsNoneIcon sx={{ color: 'white' }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: 1 }}
        PaperProps={{
          sx: { width: 380, maxHeight: 500 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Thông báo
          </Typography>
          {notifications.length > 0 && (
            <Button size="small" onClick={handleClearAll} color="error">
              Xóa tất cả
            </Button>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Chưa có thông báo nào
            </Typography>
          </Box>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <MenuItem
              key={notification.id}
              sx={{
                whiteSpace: 'normal',
                py: 1.5,
                bgcolor: notification.isRead ? 'transparent' : 'action.hover'
              }}
            >
              <Box>
                <Typography variant="body2">
                  {getNotificationIcon(notification.type)} {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(notification.createdAt, {
                    addSuffix: true,
                    locale: vi
                  })}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  )
}

export default Notifications
