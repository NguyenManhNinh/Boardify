import { useState } from 'react'
import { Box, Typography, Button, TextField, Checkbox, IconButton, LinearProgress } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

function Checklist({ checklist, onUpdate, onDelete }) {
  const [newItemText, setNewItemText] = useState('')
  const [isAddingItem, setIsAddingItem] = useState(false)

  const calculateProgress = () => {
    if (!checklist.items || checklist.items.length === 0) return 0
    const completedCount = checklist.items.filter(item => item.checked).length
    return Math.round((completedCount / checklist.items.length) * 100)
  }

  const handleAddItem = () => {
    if (!newItemText.trim()) return
    const newItem = {
      text: newItemText,
      checked: false
    }
    const newItems = [...(checklist.items || []), newItem]
    onUpdate({ ...checklist, items: newItems })
    setNewItemText('')
    setIsAddingItem(false)
  }

  const handleToggleItem = (index) => {
    const newItems = [...checklist.items]
    newItems[index] = { ...newItems[index], checked: !newItems[index].checked }
    onUpdate({ ...checklist, items: newItems })
  }

  const handleDeleteItem = (index) => {
    const newItems = checklist.items.filter((_, i) => i !== index)
    onUpdate({ ...checklist, items: newItems })
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <CheckBoxIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>{checklist.title}</Typography>
        <Button color="error" size="small" onClick={onDelete}>Delete</Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <Typography variant="caption">{calculateProgress()}%</Typography>
        <LinearProgress
          variant="determinate"
          value={calculateProgress()}
          sx={{ flexGrow: 1, borderRadius: 1, height: 8 }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {checklist.items?.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checkbox
              checked={item.checked}
              onChange={() => handleToggleItem(index)}
            />
            <Typography sx={{
              textDecoration: item.checked ? 'line-through' : 'none',
              flexGrow: 1
            }}>
              {item.text}
            </Typography>
            <IconButton size="small" onClick={() => handleDeleteItem(index)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      {!isAddingItem ? (
        <Button sx={{ mt: 1 }} onClick={() => setIsAddingItem(true)}>
          Thêm một mục
        </Button>
      ) : (
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Thêm mục..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            autoFocus
          />
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleAddItem}>Thêm</Button>
            <Button onClick={() => setIsAddingItem(false)}>Hủy</Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Checklist
