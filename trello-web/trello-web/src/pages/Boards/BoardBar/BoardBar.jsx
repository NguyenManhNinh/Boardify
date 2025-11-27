import { Box, FormControl, MenuItem, Select, Tooltip, IconButton, Menu, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material'
import Chip from '@mui/material/Chip';
import FaceIcon from '@mui/icons-material/Face';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import PublicIcon from '@mui/icons-material/Public';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import TuneIcon from '@mui/icons-material/Tune';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { capitalizeFirstLetter } from '~/utilities/formatters'
import { useAuth } from '~/customHooks/useAuthContext'
import { useState, useEffect } from 'react'
import { toggleStarredBoard, isStarredBoard } from '~/utilities/starredBoards'
import { updateBoardDetailsApi, connectGoogleDriveApi, backupToGoogleDriveApi } from '~/apis'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import AutomationDrawer from '~/components/Board/Automation/AutomationDrawer'
import FilterDrawer from '~/components/Board/Filter/FilterDrawer'
import { InviteMemberDialog } from '~/components/Board/InviteMemberDialog'

const MENU_STYLES = {
  color: 'text.primary',
  bgcolor: 'background.paper',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board, setBoard }) {
  const { user, token } = useAuth()
  const confirm = useConfirm()
  const [visibilityAnchorEl, setVisibilityAnchorEl] = useState(null)
  const [openExportDialog, setOpenExportDialog] = useState(false)
  const [openAutomationDrawer, setOpenAutomationDrawer] = useState(false)
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false)
  const [openInviteDialog, setOpenInviteDialog] = useState(false)
  const [isStarred, setIsStarred] = useState(false)
  const openVisibilityMenu = Boolean(visibilityAnchorEl)

  useEffect(() => {
    if (board?._id) {
      setIsStarred(isStarredBoard(board._id))
    }
  }, [board?._id])

  const handleToggleStar = () => {
    if (board) {
      const newStarStatus = toggleStarredBoard({
        _id: board._id,
        title: board.title
      })
      setIsStarred(newStarStatus)
    }
  }

  const handleVisibilityClick = (event) => {
    setVisibilityAnchorEl(event.currentTarget)
  }

  const handleVisibilityClose = () => {
    setVisibilityAnchorEl(null)
  }

  const handleChangeVisibility = async (visibility) => {
    handleVisibilityClose()

    if (visibility === 'public' && board?.type !== 'public') {
      try {
        await confirm({
          title: 'Đặt bảng ở chế độ công khai?',
          description: 'Ai có link đều có thể xem bảng này. Bạn có chắc chắn không?',
          confirmationText: 'Xác nhận',
          cancellationText: 'Hủy',
          dialogProps: { maxWidth: 'xs' }
        })
      } catch (e) {
        return // User cancelled
      }
    }

    if (visibility === board?.type) return

    try {
      const updatedBoard = await updateBoardDetailsApi(board._id, { type: visibility })
      setBoard(updatedBoard)
      toast.success(`Đã chuyển sang chế độ ${visibility === 'public' ? 'Công khai' : 'Riêng tư'}`)
    } catch (error) {
      toast.error('Lỗi cập nhật trạng thái bảng')
    }
  }

  const handleExportBoard = async () => {
    console.log('🔍 handleExportBoard called')
    console.log('🔍 user.isGoogleConnected:', user?.isGoogleConnected)

    if (!user?.isGoogleConnected) {
      console.log('🔍 User not connected, showing OAuth dialog')
      try {
        await confirm({
          title: 'Kết nối Google Drive',
          description: 'Bạn cần kết nối tài khoản Google Drive để sử dụng tính năng này.',
          confirmationText: 'Kết nối ngay',
          cancellationText: 'Hủy',
          dialogProps: { maxWidth: 'xs' }
        })

        const { url } = await connectGoogleDriveApi(token)
        if (url) {
          window.location.href = url
        }
      } catch (e) {
        console.log('🔍 User cancelled OAuth')
        return
      }
      return
    }

    console.log('🔍 User already connected, uploading to Drive...')
    console.log('🔍 board._id:', board._id)
    console.log('🔍 token:', token ? 'exists' : 'missing')

    try {
      toast.info('Đang lưu bản sao lên Google Drive...', { autoClose: false, toastId: 'backup-toast' })
      console.log('🔍 Calling backupToGoogleDriveApi...')

      const result = await backupToGoogleDriveApi(token, board._id)
      console.log('🔍 API Response:', result)

      toast.dismiss('backup-toast')
      if (result.success) {
        toast.success(
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">Đã lưu thành công!</Typography>
            <Button
              size="small"
              variant="contained"
              color="inherit"
              href={result.fileUrl}
              target="_blank"
              sx={{ color: 'primary.main', bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Mở file
            </Button>
          </Box>
        )
      }
      setOpenExportDialog(false)
    } catch (error) {
      console.error('❌ Error uploading to Drive:', error)
      toast.dismiss('backup-toast')
      toast.error('Lỗi khi lưu lên Google Drive')
    }
  }

  return (
    <Box
      sx={{
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        px: 2,
        color: 'white',
        flexShrink: 0,
        borderTop: '1px solid #00bfa5',
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable />
        </Tooltip>

        {/* Star toggle button */}
        <Tooltip title={isStarred ? "Bỏ gắn sao" : "Gắn sao bảng này"}>
          <IconButton
            onClick={handleToggleStar}
            size="small"
            sx={{
              color: isStarred ? '#FFD700' : (theme) => (theme.palette.mode === 'dark' ? 'white' : 'text.primary'),
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
                color: isStarred ? '#FFC700' : '#FFD700'
              },
              transition: 'all 0.2s'
            }}
          >
            {isStarred ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Tooltip>

        {/* Visibility Menu */}
        <Box>
          <Tooltip title={board?.type === 'public' ? 'Ai có link đều xem được bảng này' : 'Chỉ mình bạn xem được bảng này'}>
            <Chip
              sx={MENU_STYLES}
              icon={board?.type === 'public' ? <PublicIcon /> : <VpnLockIcon />}
              label={board?.type === 'public' ? 'Công khai' : 'Riêng tư'}
              clickable
              onClick={handleVisibilityClick}
            />
          </Tooltip>
          <Menu
            anchorEl={visibilityAnchorEl}
            open={openVisibilityMenu}
            onClose={handleVisibilityClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button-visibility' }}
          >
            <MenuItem onClick={() => handleChangeVisibility('private')} selected={board?.type === 'private'}>
              <ListItemIcon><VpnLockIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Riêng tư</ListItemText>
              {board?.type === 'private' && <ListItemIcon sx={{ justifyContent: 'flex-end' }}>✓</ListItemIcon>}
            </MenuItem>
            <MenuItem onClick={() => handleChangeVisibility('public')} selected={board?.type === 'public'}>
              <ListItemIcon><PublicIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Công khai</ListItemText>
              {board?.type === 'public' && <ListItemIcon sx={{ justifyContent: 'flex-end' }}>✓</ListItemIcon>}
            </MenuItem>
          </Menu>
        </Box>

        {/* Google Drive */}
        <Chip sx={{ ...MENU_STYLES }}
          icon={<AddToDriveIcon />}
          label="Lưu lên Google Drive"
          clickable
          onClick={() => setOpenExportDialog(true)}
        />

        {/* Export Dialog */}
        <Dialog open={openExportDialog} onClose={() => setOpenExportDialog(false)}>
          <DialogTitle>Lưu bảng lên Google Drive</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Bấm <strong>Lưu lên Drive</strong> để lưu bản sao lưu trực tiếp vào Google Drive của bạn.
            </Typography>
            {!user?.isGoogleConnected && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                (Bạn chưa kết nối tài khoản Google Drive)
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenExportDialog(false)}>Hủy</Button>
            <Button variant="contained" onClick={handleExportBoard} startIcon={<AddToDriveIcon />}>
              {user?.isGoogleConnected ? 'Lưu lên Drive' : 'Kết nối & Lưu'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Automation */}
        <Chip sx={{ ...MENU_STYLES }}
          icon={<BoltIcon />}
          label="Tự động hóa"
          clickable
          onClick={() => setOpenAutomationDrawer(true)}
        />

        <AutomationDrawer
          open={openAutomationDrawer}
          onClose={() => setOpenAutomationDrawer(false)}
          boardColumns={board?.columns}
        />

        {/* Filter */}
        <Chip sx={{ ...MENU_STYLES }}
          icon={<TuneIcon />}
          label="Lọc thẻ"
          clickable
          onClick={() => setOpenFilterDrawer(true)}
        />

        <FilterDrawer
          open={openFilterDrawer}
          onClose={() => setOpenFilterDrawer(false)}
          boardLabels={[]} // Placeholder, will need to extract labels from board
          boardMembers={board?.members || []} // Assuming board.members is populated
        />
      </Box >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        <Button
          variant="create"
          sx={{
            color: 'primary.main'
          }}
          startIcon={<PersonAddAlt1Icon />}
          onClick={() => setOpenInviteDialog(true)}
        >
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>Mời</Box>
        </Button>

        <AvatarGroup max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          {/* Display current user */}
          <Tooltip title={user?.displayName || user?.username}>
            <Avatar
              src={user?.avatar}
              alt={user?.displayName || user?.username}
            />
          </Tooltip>
        </AvatarGroup>
      </Box>

      <FilterDrawer
        open={openFilterDrawer}
        onClose={() => setOpenFilterDrawer(false)}
        boardLabels={[]}
        boardMembers={board?.members || []}
      />

      <InviteMemberDialog
        open={openInviteDialog}
        onClose={() => setOpenInviteDialog(false)}
        board={board}
        onMemberAdded={() => { }}
        onMemberRemoved={() => { }}
      />
    </Box >
  )
}

export default BoardBar
