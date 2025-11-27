import React, { useState, useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  CircularProgress,
  Chip,
  Alert,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import { debounce } from 'lodash'
import { toast } from 'react-toastify'

export const InviteMemberDialog = ({ open, onClose, board, onMemberAdded, onMemberRemoved }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [tabValue, setTabValue] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(false)

  // Email invitation state
  const [inviteEmail, setInviteEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)

  // Fetch current board members when dialog opens
  useEffect(() => {
    if (open && board?._id) {
      fetchBoardMembers()
    }
  }, [open, board?._id])

  const fetchBoardMembers = async () => {
    setLoadingMembers(true)
    try {
      const { getBoardMembersApi } = await import('~/apis')
      const token = localStorage.getItem('token')

      const response = await getBoardMembersApi(board._id, token)
      setMembers(response.data || [])
    } catch (error) {
      console.error('Error fetching members:', error)
      toast.error('Lỗi khi tải danh sách thành viên')
    } finally {
      setLoadingMembers(false)
    }
  }

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setSearchResults([])
        return
      }

      setLoading(true)
      try {
        const { searchUsersApi } = await import('~/apis')
        const token = localStorage.getItem('token')

        const response = await searchUsersApi(query, token)
        setSearchResults(response.data || [])
      } catch (error) {
        console.error('Error searching users:', error)
        toast.error('Lỗi khi tìm kiếm user')
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const handleInvite = async (user) => {
    try {
      const { addBoardMemberApi } = await import('~/apis')
      const token = localStorage.getItem('token')

      await addBoardMemberApi(board._id, user._id, token)

      toast.success(`Đã mời ${user.displayName || user.username} vào board`)

      // Refresh members list
      await fetchBoardMembers()

      // Clear search
      setSearchQuery('')
      setSearchResults([])

      // Notify parent
      if (onMemberAdded) {
        onMemberAdded(user)
      }
    } catch (error) {
      console.error('Error inviting member:', error)
      const errorMessage = error.response?.data?.message || 'Lỗi khi mời thành viên'
      toast.error(errorMessage)
    }
  }

  const handleRemove = async (userId) => {
    try {
      const { removeBoardMemberApi } = await import('~/apis')
      const token = localStorage.getItem('token')

      await removeBoardMemberApi(board._id, userId, token)

      toast.success('Đã xóa thành viên khỏi board')

      // Refresh members list
      await fetchBoardMembers()

      // Notify parent
      if (onMemberRemoved) {
        onMemberRemoved(userId)
      }
    } catch (error) {
      console.error('Error removing member:', error)
      const errorMessage = error.response?.data?.message || 'Lỗi khi xóa thành viên'
      toast.error(errorMessage)
    }
  }

  // Email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Handle send email invitation
  const handleSendEmailInvite = async () => {
    setEmailError('')

    if (!inviteEmail.trim()) {
      setEmailError('Vui lòng nhập email')
      return
    }

    if (!validateEmail(inviteEmail)) {
      setEmailError('Email không hợp lệ')
      return
    }

    setSendingEmail(true)
    try {
      const { sendBoardInvitationApi } = await import('~/apis')
      const token = localStorage.getItem('token')

      await sendBoardInvitationApi(board._id, inviteEmail, token)

      toast.success(`Đã gửi lời mời đến ${inviteEmail}`)
      setInviteEmail('')
    } catch (error) {
      console.error('Error sending invitation:', error)
      const errorMessage = error.response?.data?.message || 'Lỗi khi gửi lời mời'
      toast.error(errorMessage)
    } finally {
      setSendingEmail(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Mời thành viên vào Boardify</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Tabs for switching between search and email invite */}
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
          <Tab label="Tìm kiếm user" />
          <Tab label="Mời qua email" icon={<EmailIcon />} iconPosition="start" />
        </Tabs>

        {/* Tab Panel 0: Search existing users */}
        {tabValue === 0 && (
          <Box>
            <TextField
              fullWidth
              placeholder="Tìm kiếm bằng email, username..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
              InputProps={{
                endAdornment: loading && <CircularProgress size={20} />
              }}
              sx={{ mb: 2 }}
            />

            {/* Search Results */}
            {searchResults.length > 0 && (
              <List sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                {searchResults.map((user) => {
                  const isAlreadyMember = members.some(m => m._id === user._id)
                  return (
                    <ListItem
                      key={user._id}
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <ListItemAvatar>
                        <Avatar src={user.avatar}>{user.displayName?.[0] || user.username?.[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.displayName || user.username}
                        secondary={user.email}
                      />
                      <ListItemSecondaryAction>
                        {isAlreadyMember ? (
                          <Chip label="Đã là thành viên" size="small" />
                        ) : (
                          <Button
                            size="small"
                            startIcon={<PersonAddIcon />}
                            onClick={() => handleInvite(user)}
                          >
                            Mời
                          </Button>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                })}
              </List>
            )}
          </Box>
        )}

        {/* Tab Panel 1: Email invitation */}
        {tabValue === 1 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Nhập email của người bạn muốn mời. Họ sẽ nhận được email với link để tham gia Boardify.
            </Alert>

            <TextField
              fullWidth
              label="Email"
              placeholder="user@gmail.com"
              value={inviteEmail}
              onChange={(e) => {
                setInviteEmail(e.target.value)
                setEmailError('')
              }}
              error={!!emailError}
              helperText={emailError}
              autoFocus
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              startIcon={sendingEmail ? <CircularProgress size={20} /> : <EmailIcon />}
              onClick={handleSendEmailInvite}
              disabled={sendingEmail}
            >
              {sendingEmail ? 'Đang gửi...' : 'Gửi lời mời'}
            </Button>
          </Box>
        )}

        {/* Current Members Section */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Thành viên hiện tại ({members.length})
          </Typography>

          {loadingMembers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : members.length === 0 ? (
            <Alert severity="info">Chưa có thành viên nào</Alert>
          ) : (
            <List>
              {members.map((member) => (
                <ListItem key={member._id}>
                  <ListItemAvatar>
                    <Avatar src={member.avatar}>{member.displayName?.[0] || member.username?.[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {member.displayName || member.username}
                        {member.role === 'owner' && (
                          <Chip label="Chủ sở hữu" size="small" color="primary" />
                        )}
                      </Box>
                    }
                    secondary={member.email}
                  />
                  {member.role !== 'owner' && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemove(member._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  )
}
