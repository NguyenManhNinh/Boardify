import { useState, useEffect } from 'react'
import { Box, Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, CircularProgress, IconButton } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CloseIcon from '@mui/icons-material/Close'
import { getRecentActivities, hideActivity } from '~/services/profileService'

// Helper to format relative time
const formatRelativeTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}

// Map action types to Vietnamese messages
const actionMessages = {
  create_board: { action: 'đã tạo bảng', type: 'create' },
  create_card: { action: 'đã tạo thẻ', type: 'create' },
  complete_card: { action: 'đã hoàn thành thẻ', type: 'complete' },
  update_card: { action: 'đã cập nhật thẻ', type: 'update' }
}

function ProfileRecentActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchActivities = async () => {
    try {
      const response = await getRecentActivities()
      setActivities(response.data || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const handleHideActivity = async (activityId) => {
    try {
      await hideActivity(activityId)
      // Remove from local state immediately for better UX
      setActivities(prev => prev.filter(a => a.id !== activityId))
    } catch (error) {
      console.error('Error hiding activity:', error)
    }
  }

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px'
        }}
      >
        <CircularProgress />
      </Paper>
    )
  }

  return (
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AccessTimeIcon sx={{ color: 'text.secondary', mr: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.1rem' }}>
          Hoạt động gần đây
        </Typography>
      </Box>

      {activities.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          Chưa có hoạt động nào
        </Typography>
      ) : (
        <List sx={{ p: 0 }}>
          {activities.map((item, index) => {
            const actionInfo = actionMessages[item.action] || { action: 'đã thực hiện', type: 'update' }

            return (
              <ListItem
                key={item.id}
                alignItems="flex-start"
                sx={{
                  px: 0,
                  py: 2,
                  borderBottom: '1px solid',
                  borderColor: index < activities.length - 1 ? 'divider' : 'transparent',
                  position: 'relative',
                  '&:hover .delete-button': {
                    opacity: 1
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: 'action.hover',
                      color: 'text.primary',
                      width: 36,
                      height: 36,
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    B
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5, pr: 4 }}>
                      <Box component="span" sx={{ fontWeight: 600 }}>Bạn</Box>
                      {' '}{actionInfo.action}{' '}
                      {item.targetTitle && <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>"{item.targetTitle}"</Box>}
                      {item.boardTitle && item.action !== 'create_board' && (
                        <>
                          {' '}trong bảng{' '}
                          <Box component="span" sx={{ fontWeight: 600 }}>{item.boardTitle}</Box>
                        </>
                      )}
                      {item.boardTitle && item.action === 'create_board' && (
                        <>
                          {' '}<Box component="span" sx={{ fontWeight: 600 }}>{item.boardTitle}</Box>
                        </>
                      )}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                      {formatRelativeTime(item.time)}
                    </Typography>
                  }
                />
                <IconButton
                  className="delete-button"
                  size="small"
                  onClick={() => handleHideActivity(item.id)}
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      color: 'text.primary'
                    }
                  }}
                  aria-label="Ẩn hoạt động"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </ListItem>
            )
          })}
        </List>
      )}
    </Paper>
  )
}

export default ProfileRecentActivity
