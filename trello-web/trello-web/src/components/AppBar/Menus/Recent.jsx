import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Button, Menu, MenuItem, ListItemIcon, ListItemText,
  Divider, Typography, Box
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { getRecentBoards, clearRecentBoards } from '~/utilities/recentBoards'
import { selectMyBoards } from '~/redux/board/boardSlice'
import { toast } from 'react-toastify'

function Recent() {
  const navigate = useNavigate()
  const location = useLocation()
  const boards = useSelector(selectMyBoards)
  const [anchorEl, setAnchorEl] = useState(null)
  const [recentBoards, setRecentBoards] = useState([])
  const open = Boolean(anchorEl)

  // Refresh list when menu opens or location/boards change
  useEffect(() => {
    if (open) {
      const recent = getRecentBoards()
      // Enrich with background color from Redux if available
      const enrichedRecent = recent.map(r => {
        const fullBoard = boards.find(b => b._id === r._id)
        return {
          ...r,
          background: fullBoard?.background // Add background if found
        }
      })
      setRecentBoards(enrichedRecent)
    }
  }, [open, location.pathname, boards])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleBoardClick = (boardId) => {
    navigate(`/boards/${boardId}`)
    handleClose()
  }

  const handleClearRecent = () => {
    clearRecentBoards()
    setRecentBoards([])
    toast.success('Đã xóa lịch sử bảng gần đây')
    // Don't close menu to show empty state
  }

  return (
    <>
      <Button
        id="recent-button"
        aria-controls={open ? 'recent-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        sx={{ color: 'white' }}
        aria-label="Mở danh sách bảng gần đây"
      >
        Bảng gần đây
      </Button>

      <Menu
        id="recent-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: 1 }}
        MenuListProps={{
          'aria-labelledby': 'recent-button',
        }}
        PaperProps={{
          sx: { width: 300, maxHeight: 400 }
        }}
      >
        {/* Header */}
        <Typography
          variant="subtitle2"
          sx={{
            px: 2,
            pt: 1,
            pb: 0.5,
            color: 'text.secondary',
            fontWeight: 600
          }}
        >
          Bảng bạn vừa mở gần đây
        </Typography>

        {/* Empty State */}
        {recentBoards.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Chưa có bảng nào gần đây
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
              Mở một bảng để hiển thị tại đây
            </Typography>
          </Box>
        ) : (
          <>
            {/* Board List */}
            <Box sx={{ maxHeight: 280, overflowY: 'auto' }}>
              {recentBoards.map((board) => (
                <MenuItem
                  key={board._id}
                  onClick={() => handleBoardClick(board._id)}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  {/* Color Box (like board thumbnail) */}
                  <Box
                    sx={{
                      width: 32,
                      height: 24,
                      borderRadius: 1,
                      mr: 1.5,
                      bgcolor: board.background || 'primary.main',
                      flexShrink: 0
                    }}
                  />
                  <ListItemText
                    primary={board.title}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      noWrap: true
                    }}
                  />
                </MenuItem>
              ))}
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Clear Action */}
            <MenuItem
              onClick={handleClearRecent}
              sx={{
                py: 1.5,
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.light',
                  color: 'error.dark'
                }
              }}
            >
              <ListItemIcon>
                <DeleteOutlineIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Xóa lịch sử bảng gần đây"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}
              />
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  )
}

export default Recent
