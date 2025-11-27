import { useState } from 'react'
import { Box, Button, Popover, Typography, TextField } from '@mui/material'

function DueDatePicker({ anchorEl, onClose, onSave, initialDate }) {
  // Convert ISO date to datetime-local format (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [date, setDate] = useState(formatDateForInput(initialDate));

  const handleSave = () => {
    // Convert datetime-local string to timestamp (milliseconds) for backend
    const timestamp = date ? new Date(date).getTime() : null;
    onSave(timestamp);
    onClose();
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      <Box sx={{ p: 2, width: 250 }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem', fontWeight: 600 }}>
          Ngày hết hạn
        </Typography>
        <TextField
          fullWidth
          type="datetime-local"
          size="small"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{
            mb: 2,
            '& input::-webkit-calendar-picker-indicator': {
              filter: (theme) => (theme.palette.mode === 'dark' ? 'invert(1)' : 'none'),
              cursor: 'pointer'
            }
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
        <Button variant="contained" onClick={handleSave} fullWidth>
          Lưu
        </Button>
      </Box>
    </Popover>
  )
}

export default DueDatePicker
