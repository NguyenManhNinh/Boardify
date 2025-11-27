import { useColorScheme } from '@mui/material/styles'
import { Box, FormControl, MenuItem, Select } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()

  return (
    <FormControl size="small" sx={{minWidth:'120px'}}>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        sx={{
          color: 'white',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '& .MuiSvgIcon-root': { color: 'white' }
        }}
      >
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightModeIcon fontSize="small" />
            <Box component="span">Light</Box>
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeIcon fontSize="small" />
            <Box component="span">Dark</Box>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}
export default ModeSelect
