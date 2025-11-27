import { useState, useEffect } from 'react'
import { Box, Button, Popover, Typography, TextField, Avatar, List, ListItem, ListItemAvatar, ListItemText, CircularProgress } from '@mui/material'
import { fetchUsersAPI } from '~/apis'
import { useAuth } from '~/customHooks/useAuthContext'

function MemberPicker({ anchorEl, onClose, onAddMember, currentMembers = [] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([])
        return
      }

      setLoading(true)
      try {
        const result = await fetchUsersAPI(token, searchQuery)
        setSearchResults(result.data || [])
      } catch (error) {
        console.error('Error searching users:', error)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimeout = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounceTimeout)
  }, [searchQuery, token])

  const handleSelectUser = (user) => {
    onAddMember(user._id)
    setSearchQuery('')
    setSearchResults([])
    onClose()
  }

  const isUserAlreadyMember = (userId) => {
    return currentMembers.includes(userId)
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      <Box sx={{ p: 2, width: 320 }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem', fontWeight: 600 }}>
          Thành viên
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Tìm thành viên theo email hoặc tên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          sx={{ mb: 2 }}
        />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!loading && searchResults.length > 0 && (
          <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {searchResults.map((user) => (
              <ListItem
                key={user._id}
                onClick={() => !isUserAlreadyMember(user._id) && handleSelectUser(user)}
                sx={{
                  cursor: isUserAlreadyMember(user._id) ? 'default' : 'pointer',
                  opacity: isUserAlreadyMember(user._id) ? 0.5 : 1,
                  '&:hover': {
                    bgcolor: isUserAlreadyMember(user._id) ? 'transparent' : 'action.hover'
                  },
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar} alt={user.displayName || user.username}>
                    {(user.displayName || user.username || user.email).charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.displayName || user.username}
                  secondary={user.email}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                {isUserAlreadyMember(user._id) && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Đã thêm
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
        )}

        {!loading && searchQuery.length >= 2 && searchResults.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Không tìm thấy người dùng
          </Typography>
        )}

        {searchQuery.length < 2 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Nhập ít nhất 2 ký tự để tìm kiếm
          </Typography>
        )}
      </Box>
    </Popover>
  )
}

export default MemberPicker
