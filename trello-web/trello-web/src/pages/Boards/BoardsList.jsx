import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Avatar,
  AvatarGroup,
  Tooltip,
  Skeleton,
  Alert
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SettingsIcon from '@mui/icons-material/Settings'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

import AppBar from '~/components/AppBar/AppBar'
import { getUserBoards, updateBoard } from '~/services/boardsService'
import CreateBoardDialog from '~/components/Board/CreateBoardDialog'
import { EmptyBoardsHero } from './EmptyBoardsHero'
import { useAuth } from '~/customHooks/useAuthContext'
import { formatRelativeTime } from '~/utilities/formatters'
import { toast } from 'react-toastify'

export const BoardsList = () => {
  const navigate = useNavigate()
  const { user } = useAuth() || {}

  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  // toolbar states
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | starred | recent
  const [sortBy, setSortBy] = useState('recent') // recent | az | cards

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      setLoading(true)
      const response = await getUserBoards()
      const boardsData = response?.data || response?.boards || response || []
      setBoards(Array.isArray(boardsData) ? boardsData : [])
    } catch (error) {
      console.error('Failed to fetch boards:', error)
      setBoards([])
    } finally {
      setLoading(false)
    }
  }

  const handleBoardClick = (boardId) => {
    navigate(`/boards/${boardId}`)
  }

  const handleToggleStar = async (e, boardId, isStarred) => {
    e.stopPropagation()
    try {
      // Optimistic update
      const newBoards = boards.map(b =>
        b._id === boardId ? { ...b, isStarred: !isStarred } : b
      )
      setBoards(newBoards)

      await updateBoard(boardId, { isStarred: !isStarred })
    } catch (error) {
      // Revert on error
      const revertedBoards = boards.map(b =>
        b._id === boardId ? { ...b, isStarred: isStarred } : b
      )
      setBoards(revertedBoards)
      toast.error('Không thể cập nhật trạng thái bảng')
    }
  }

  const handleSettings = (e, boardId) => {
    e.stopPropagation()
    // For now, just show a toast or navigate if we had a settings page
    // Since we don't have a dedicated settings page yet, we'll just open the board
    // or maybe show a "Coming Soon" toast
    toast.info('Tính năng cài đặt bảng đang được phát triển')
  }

  const filteredBoards = useMemo(() => {
    let result = [...boards]

    // search
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((b) => b.title?.toLowerCase().includes(q))
    }

    // filter
    if (filter === 'starred') {
      result = result.filter((b) => b.isStarred)
    }

    // sort
    if (sortBy === 'az') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    } else if (sortBy === 'cards') {
      result.sort((a, b) => (b.cardCount || 0) - (a.cardCount || 0))
    } else if (sortBy === 'recent') {
      result.sort(
        (a, b) =>
          new Date(b.lastActivity || b.createdAt || 0) -
          new Date(a.lastActivity || a.createdAt || 0)
      )
    }

    return result
  }, [boards, search, filter, sortBy])

  const clearFilters = () => {
    setSearch('')
    setFilter('all')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f5f7' }}>
      <AppBar />

      {!loading && boards.length === 0 ? (
        <EmptyBoardsHero onOpenCreateBoard={() => setOpenCreateDialog(true)} />
      ) : (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 3,
              gap: 2
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#172b4d' }}>
                Bảng của tôi
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#6b778c', mt: 0.5 }}>
                Xin chào{user?.displayName ? `, ${user.displayName}` : ''}! Tiếp tục công việc hôm nay nhé 👋
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateDialog(true)}
                fullWidth
                sx={{
                  bgcolor: '#0052cc',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': { bgcolor: '#0065ff' }
                }}
              >
                Tạo bảng mới
              </Button>
            </Box>
          </Box>

          {/* Toolbar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              mb: 3,
              alignItems: { xs: 'stretch', md: 'center' }
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'white',
                borderRadius: 2,
                px: 2,
                py: 0.5,
                boxShadow: '0 1px 3px rgba(9,30,66,0.08)',
                transition: 'box-shadow 0.2s',
                '&:focus-within': {
                  boxShadow: '0 0 0 2px #4c9aff'
                }
              }}
            >
              <SearchIcon sx={{ mr: 1, color: '#6b778c' }} />
              <TextField
                id="board-search-input"
                variant="standard"
                fullWidth
                placeholder="Tìm kiếm bảng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  disableUnderline: true
                }}
              />
              {search && (
                <IconButton size="small" onClick={() => setSearch('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                id="board-filter-select"
                select
                size="small"
                label="Lọc"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="starred">Đã gắn sao</MenuItem>
              </TextField>

              <TextField
                id="board-sort-select"
                select
                size="small"
                label="Sắp xếp"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="recent">Mới nhất</MenuItem>
                <MenuItem value="az">A–Z</MenuItem>
                <MenuItem value="cards">Nhiều thẻ</MenuItem>
              </TextField>
            </Box>
          </Box>

          {/* Boards grid */}
          <Grid container spacing={3}>
            {loading ? (
              // Skeleton Loading
              Array.from(new Array(4)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
                </Grid>
              ))
            ) : filteredBoards.length > 0 ? (
              filteredBoards.map((board) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={board._id}>
                  <Card
                    onClick={() => handleBoardClick(board._id)}
                    tabIndex={0}
                    sx={{
                      cursor: 'pointer',
                      height: 160,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 3,
                      background: board.background || '#0079bf',
                      color: 'white',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px) scale(1.01)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
                        '& .board-actions': { opacity: 1, transform: 'translateY(0)' }
                      },
                      '&:focus-visible': {
                        outline: '3px solid #4c9aff',
                        outlineOffset: '2px'
                      }
                    }}
                  >
                    {/* gradient overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.1))'
                      }}
                    />

                    <CardContent
                      sx={{
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        p: 2
                      }}
                    >
                      {/* Title */}
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {board.title}
                        </Typography>

                        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                          {(board.columnCount || 0) + ' lists · ' + (board.cardCount || 0) + ' cards'}
                        </Typography>
                      </Box>

                      {/* bottom row */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1
                        }}
                      >
                        <Box>
                          <Typography variant="caption" sx={{ opacity: 0.85 }}>
                            {formatRelativeTime(board.lastActivity || board.updatedAt)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {Array.isArray(board.members) && board.members.length > 0 && (
                            <AvatarGroup
                              max={3}
                              sx={{
                                '& .MuiAvatar-root': {
                                  width: 24,
                                  height: 24,
                                  fontSize: 12,
                                  borderColor: 'rgba(255,255,255,0.8)'
                                }
                              }}
                            >
                              {board.members.map((m) => (
                                <Avatar key={m._id} src={m.avatar} alt={m.displayName}>
                                  {m.displayName?.[0] || 'U'}
                                </Avatar>
                              ))}
                            </AvatarGroup>
                          )}

                          {/* Quick actions */}
                          <Box
                            className="board-actions"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              opacity: 0,
                              transform: 'translateY(6px)',
                              transition: 'all 0.18s ease'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Tooltip title="Mở bảng">
                              <IconButton
                                size="small"
                                sx={{ color: 'white' }}
                                onClick={() => handleBoardClick(board._id)}
                              >
                                <OpenInNewIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Cài đặt bảng">
                              <IconButton
                                size="small"
                                sx={{ color: 'white' }}
                                onClick={(e) => handleSettings(e, board._id)}
                              >
                                <SettingsIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={board.isStarred ? 'Bỏ gắn sao' : 'Gắn sao'}>
                              <IconButton
                                size="small"
                                sx={{ color: 'white' }}
                                onClick={(e) => handleToggleStar(e, board._id, board.isStarred)}
                              >
                                {board.isStarred ? (
                                  <StarIcon fontSize="inherit" />
                                ) : (
                                  <StarBorderIcon fontSize="inherit" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              // Empty State for Search/Filter
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    bgcolor: 'white',
                    borderRadius: 3,
                    border: '1px dashed #dfe1e6'
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#6b778c', mb: 1 }}>
                    Không tìm thấy bảng nào phù hợp
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b778c', mb: 3 }}>
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn
                  </Typography>
                  <Button variant="outlined" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      )}

      <CreateBoardDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      />
    </Box>
  )
}
