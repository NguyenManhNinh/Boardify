import { Box, Grid, Paper, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'

function ProfileOverviewStats({ user }) {
  // Use real stats from API, show 0 while loading
  const stats = [
    {
      id: 1,
      label: 'Bảng của bạn',
      value: user?.stats?.boardsCreated ?? 0,
      icon: <DashboardIcon sx={{ fontSize: 32, color: '#0079BF' }} />,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(0, 121, 191, 0.2)' : '#E6FCFF')
    },
    {
      id: 2,
      label: 'Thẻ đã xong',
      value: user?.stats?.tasksCompleted ?? 0,
      icon: <CheckCircleIcon sx={{ fontSize: 32, color: '#2ecc71' }} />,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(46, 204, 113, 0.2)' : '#EAFAF1')
    },
    {
      id: 3,
      label: 'Danh sách',
      value: user?.stats?.totalLists ?? 0,
      icon: <AssignmentIcon sx={{ fontSize: 32, color: '#f39c12' }} />,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(243, 156, 18, 0.2)' : '#FEF9E7')
    },
    {
      id: 4,
      label: 'Đang hoạt động',
      value: user?.stats?.activeBoards ?? 0,
      icon: <PlaylistAddCheckIcon sx={{ fontSize: 32, color: '#8e44ad' }} />,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(142, 68, 173, 0.2)' : '#F4ECF7')
    }
  ]

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.id}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: stat.bgcolor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {stat.icon}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default ProfileOverviewStats
