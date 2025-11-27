import { useNavigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import DashboardIcon from '@mui/icons-material/Dashboard'
import StarIcon from '@mui/icons-material/Star'
import FlashOnIcon from '@mui/icons-material/FlashOn'

function ProfileQuickActions() {
  const navigate = useNavigate()

  const handleCreateBoard = () => {
    // Navigate to boards page - user can use navbar to create new board
    navigate('/boards')
  }

  const handleViewRecentBoards = () => {
    // Navigate to boards page showing recent boards
    navigate('/boards')
  }

  const handleViewStarredBoards = () => {
    // Future feature - starred boards
    alert('Tính năng "Bảng đã đánh dấu sao" sẽ được cập nhật trong phiên bản sau!')
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#FAFBFC')
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FlashOnIcon sx={{ color: '#f39c12', mr: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.1rem' }}>
          Thao tác nhanh
        </Typography>
      </Box>

      <Stack spacing={2}>
        <Button
          variant="contained"
          startIcon={<AddBoxIcon />}
          fullWidth
          onClick={handleCreateBoard}
          sx={{
            justifyContent: 'flex-start',
            py: 1.5,
            px: 2,
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'text.secondary',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        >
          Tạo bảng mới
        </Button>

        <Button
          variant="contained"
          startIcon={<DashboardIcon />}
          fullWidth
          onClick={handleViewRecentBoards}
          sx={{
            justifyContent: 'flex-start',
            py: 1.5,
            px: 2,
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'text.secondary',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        >
          Xem bảng gần đây
        </Button>

        <Button
          variant="contained"
          startIcon={<StarIcon sx={{ color: '#f1c40f' }} />}
          fullWidth
          onClick={handleViewStarredBoards}
          sx={{
            justifyContent: 'flex-start',
            py: 1.5,
            px: 2,
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            textTransform: 'none',
            fontWeight: 600,
            opacity: 0.6,
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'text.secondary',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              opacity: 0.8
            }
          }}
        >
          Bảng đã đánh dấu sao
        </Button>
      </Stack>

      <Box sx={{
        mt: 4,
        p: 2,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(0, 121, 191, 0.1)' : '#E6FCFF'),
        borderRadius: '8px',
        border: '1px dashed',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? '#0079BF' : '#0079BF')
      }}>
        <Typography variant="subtitle2" sx={{ color: '#0079BF', fontWeight: 600, mb: 1 }}>
          Mẹo nhỏ 💡
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
          Bạn có thể dùng phím tắt <strong>Ctrl + B</strong> để mở nhanh menu bảng từ bất kỳ đâu.
        </Typography>
      </Box>
    </Paper>
  )
}

export default ProfileQuickActions
