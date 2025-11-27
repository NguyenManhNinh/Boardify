import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Button, Menu, MenuItem, ListItemIcon, ListItemText,
  Box, Typography, IconButton, Tooltip, Divider
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { getStarredBoards, toggleStarredBoard } from '~/utilities/starredBoards'
import { selectMyBoards } from '~/redux/board/boardSlice'

function Starred() {
  const navigate = useNavigate()
  const boards = useSelector(selectMyBoards)
  const [anchorEl, setAnchorEl] = useState(null)
  const [starredBoards, setStarredBoards] = useState([])
  const open = Boolean(anchorEl)

  // Refresh list when menu opens or boards change
  useEffect(() => {
    if (open) {
      const starredIds = getStarredBoards().map(b => b._id)
      // Merge with full board details from Redux if available
      const enrichedStarred = starredIds.map(id => {
        const fullBoard = boards.find(b => b._id === id)
        if (fullBoard) return fullBoard
        // Fallback to localStorage data if not in Redux yet (rare)
        return getStarredBoards().find(b => b._id === id)
      }).filter(Boolean)

      setStarredBoards(enrichedStarred)
    }
  }, [open, boards])

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

  const handleUnstar = (e, board) => {
    e.stopPropagation()
    toggleStarredBoard(board)
    // Update local state immediately
    setStarredBoards(prev => prev.filter(b => b._id !== board._id))
  }

  return (
    <>
      <Button
        id="starred-button"
        aria-controls={open ? 'starred-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        sx={{ color: 'white' }}
        aria-label="Mở danh sách bảng yêu thích"
      >
        Bảng yêu thích
      </Button>
      <Menu
        id="starred-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: 1 }}
        MenuListProps={{
          'aria-labelledby': 'starred-button',
        }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        {starredBoards.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <StarBorderIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Chưa có bảng được gắn sao
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
              Gắn sao bảng quan trọng để truy cập nhanh hơn.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            <Typography variant="subtitle2" sx={{ px: 2, pt: 1, pb: 0.5, color: 'text.secondary', fontWeight: 600 }}>
              Bảng yêu thích của bạn
            </Typography>
            {starredBoards.map((board) => (
              <MenuItem
                key={board._id}
                onClick={() => handleBoardClick(board._id)}
                sx={{
                  py: 1.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  {/* Thumbnail */}
                  <Box
                    sx={{
                      width: 32,
                      height: 24,
                      borderRadius: 1,
                      mr: 1.5,
                      bgcolor: board?.background || 'primary.main',
                      flexShrink: 0
                    }}
                  />
                  <ListItemText
                    primary={board.title}
                    secondary={board.type === 'private' ? 'Riêng tư' : 'Công khai'}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      noWrap: true
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>

                {/* Unstar Action */}
                <Tooltip title="Bỏ gắn sao">
                  <IconButton
                    size="small"
                    onClick={(e) => handleUnstar(e, board)}
                    sx={{
                      ml: 1,
                      color: '#FFD700',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <StarIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>
    </>
  )
}

export default Starred
