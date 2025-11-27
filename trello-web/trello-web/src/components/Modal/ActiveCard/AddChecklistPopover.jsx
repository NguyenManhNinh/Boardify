import { useState } from 'react'
import { Box, Button, Popover, TextField, Typography } from '@mui/material'

function AddChecklistPopover({ anchorEl, onClose, onAdd }) {
  const [title, setTitle] = useState('Checklist')

  const handleAdd = () => {
    if (!title.trim()) return
    onAdd(title)
    setTitle('Checklist')
    onClose()
  }

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
          Thêm danh sách công việc
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Tiêu đề
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleAdd}>
          Thêm
        </Button>
      </Box>
    </Popover>
  )
}

export default AddChecklistPopover
