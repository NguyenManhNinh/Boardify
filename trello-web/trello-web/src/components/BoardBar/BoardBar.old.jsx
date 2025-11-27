import { Box, Chip, Button, Stack, Avatar, AvatarGroup, Tooltip } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: '58px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      borderBottom: '1px solid white',
      borderColor: 'primary.border',
      bgcolor:(theme)=>(theme.palette.mode==='dark' ? '#2c3e50':'#1976d2'),
    }}>
      <Stack direction="row" alignItems="center" gap={2}>
        <Chip
          icon={<DashboardIcon />}
          label="DevWeb Board"
          clickable
          sx={{
            color: 'white',
            bgcolor: 'transparent',
            border: 'none',
            '& .MuiSvgIcon-root': {
              color: 'white'
            },
            '&:hover': {
              bgcolor: 'primary.50'
            }
          }}
        />
        <Chip
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
          sx={{
            color: 'white',
            bgcolor: 'transparent',
            border: 'none',
            '& .MuiSvgIcon-root': {
              color: 'white'
            },
            '&:hover': {
              bgcolor: 'primary.50'
            }
          }}
        />
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title="Remy Sharp">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Travis Howard">
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          </Tooltip>
          <Tooltip title="Cindy Baker">
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          </Tooltip>
          <Tooltip title="Agnes Walker">
            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          </Tooltip>
        </AvatarGroup>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
      </Stack>
      <Stack direction="row" alignItems="center" gap={2}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Filters
        </Button>
        <Button
          variant="outlined"
          startIcon={<BoltIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Automation
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddToDriveIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Power-Ups
        </Button>
      </Stack>
    </Box>
  )
}
export default BoardBar