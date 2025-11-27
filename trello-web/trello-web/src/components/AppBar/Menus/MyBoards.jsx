import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box, Button, Menu, MenuItem, ListItemIcon,
  ListItemText, Typography, Divider, CircularProgress, IconButton
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import {
  fetchMyBoards,
  selectMyBoards,
  selectBoardsLoading,
  selectBoardsError
} from '~/redux/board/boardSlice'
import { removeRecentBoard } from '~/utilities/recentBoards'
import CreateBoardDialog from '~/components/Board/CreateBoardDialog'
import { deleteBoardApi } from '~/apis'
import { useAuth } from '~/customHooks/useAuthContext'

function MyBoards() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, token } = useAuth()
  const boards = useSelector(selectMyBoards)
  const loading = useSelector(selectBoardsLoading)
  const error = useSelector(selectBoardsError)
  const [anchorEl, setAnchorEl] = useState(null)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [hoveredBoardId, setHoveredBoardId] = useState(null)
  const open = Boolean(anchorEl)

  // Fetch boards when menu opens (only once when opening)
  useEffect(() => {
    if (open && !loading) {
      dispatch(fetchMyBoards())
    }
  }, [open, dispatch])

  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleOpenBoard = (boardId) => {
    navigate(`/boards/${boardId}`)
    handleClose()
  }

  const handleCreateBoard = () => {
    handleClose() // Close menu first
    setOpenCreateDialog(true)
  }

  const handleDeleteBoard = async (event, boardId) => {
    event.stopPropagation() // Prevent menu item click

    try {
      await deleteBoardApi(boardId, token)
      toast.success('Đã xóa board thành công')

      // Remove from recent boards
      removeRecentBoard(boardId)

      // Refresh boards list
      dispatch(fetchMyBoards())

      // Close menu
      handleClose()

      // Only redirect if currently viewing the deleted board
      const currentPath = window.location.pathname
      if (currentPath.includes(boardId)) {
        navigate('/boards')
      }
    } catch (error) {
      console.error('Delete board error:', error)
      toast.error('Không thể xóa board')
    }
  }

  return (
    <>
      <Button
        id="my-boards-button"
        aria-controls={open ? 'my-boards-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        sx={{ color: 'white' }}
        aria-label="Mở danh sách bảng của tôi"
      >
        Bảng của tôi
      </Button>

      <Menu
        id="my-boards-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: 1 }}
        MenuListProps={{
          'aria-labelledby': 'my-boards-button',
        }}
        PaperProps={{
          sx: { width: 320, maxHeight: 480 }
        }}
      >
        {/* Loading */}
        {loading && (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {/* Error */}
        {error && !loading && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="error" fontWeight={500}>
              Không tải được danh sách bảng
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Vui lòng thử lại sau
            </Typography>
          </Box>
        )}

        {/* Content */}
        {!loading && !error && (
          <>

            {/* All Boards */}
            <Typography variant="subtitle2" sx={{ px: 2, pb: 0.5, color: 'text.secondary', fontWeight: 600 }}>
              Bảng của tôi
            </Typography>

            {boards.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Bạn chưa có bảng nào
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                  Hãy tạo bảng đầu tiên!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 280, overflowY: 'auto' }}>
                {boards.filter(board => board && board._id).map(board => (
                  <MenuItem
                    key={board._id}
                    onClick={() => handleOpenBoard(board._id)}
                    onMouseEnter={() => setHoveredBoardId(board._id)}
                    onMouseLeave={() => setHoveredBoardId(null)}
                    sx={{ py: 1.5, display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                      <Box sx={{ width: 32, height: 24, borderRadius: 1, mr: 1.5, bgcolor: board?.background || '#0c66e4', flexShrink: 0 }} />
                      <ListItemText
                        primary={board.title}
                        secondary={board.type === 'private' ? 'Riêng tư' : 'Công khai'}
                        primaryTypographyProps={{ fontWeight: 500, fontSize: '0.95rem' }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                    </Box>
                    {hoveredBoardId === board._id && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteBoard(e, board._id)}
                        sx={{ ml: 1, flexShrink: 0 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </MenuItem>
                ))}
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Actions */}
            <MenuItem onClick={handleCreateBoard} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Tạo bảng mới" primaryTypographyProps={{ fontWeight: 600, color: 'primary.main' }} />
            </MenuItem>
          </>
        )}
      </Menu>

      <CreateBoardDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      />
    </>
  )
}

export default MyBoards
