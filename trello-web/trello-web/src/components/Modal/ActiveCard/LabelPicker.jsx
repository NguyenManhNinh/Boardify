import { useState } from 'react'
import { Box, Button, Popover, Typography, TextField, Grid } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

const LABEL_COLORS = [
  { name: 'Green', value: '#61bd4f' },
  { name: 'Yellow', value: '#f2d600' },
  { name: 'Orange', value: '#ff9f1a' },
  { name: 'Red', value: '#eb5a46' },
  { name: 'Purple', value: '#c377e0' },
  { name: 'Blue', value: '#0079bf' }
]

function LabelPicker({ anchorEl, onClose, onAddLabel }) {
  const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[0].value)
  const [labelText, setLabelText] = useState('')

  const handleAdd = () => {
    if (!selectedColor) return
    onAddLabel({
      text: labelText,
      color: selectedColor
    })
    setLabelText('')
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
      <Box sx={{ p: 2, width: 300 }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem', fontWeight: 600 }}>
          Nhãn
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Tìm hoặc tạo nhãn..."
          value={labelText}
          onChange={(e) => setLabelText(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Chọn màu
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {LABEL_COLORS.map((color) => (
            <Grid item xs={3} key={color.value}>
              <Box
                onClick={() => setSelectedColor(color.value)}
                sx={{
                  width: '100%',
                  height: 32,
                  bgcolor: color.value,
                  borderRadius: 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                {selectedColor === color.value && <CheckIcon sx={{ color: 'white', fontSize: 16 }} />}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          fullWidth
          onClick={handleAdd}
          disabled={!selectedColor}
        >
          Tạo mới
        </Button>
      </Box>
    </Popover>
  )
}

export default LabelPicker
