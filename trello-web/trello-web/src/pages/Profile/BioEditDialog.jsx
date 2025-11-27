import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

function BioEditDialog({ open, onClose, currentBio, onSave }) {
  const [bio, setBio] = useState(currentBio || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      await onSave(bio)
      onClose()
    } catch (error) {
      console.error('Error saving bio:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setBio(currentBio || '')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#172B4D' }}>
            Giới thiệu về bạn
          </Typography>
          <IconButton size="small" onClick={handleClose} aria-label="Đóng">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <TextField
          autoFocus
          fullWidth
          multiline
          rows={6}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Hãy chia sẻ một chút về bản thân bạn..."
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: '#0052CC'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0052CC',
                borderWidth: 2
              }
            }
          }}
        />
        <Typography variant="caption" sx={{ color: '#5E6C84', mt: 1, display: 'block' }}>
          {bio.length} / 500 ký tự
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          sx={{
            textTransform: 'none',
            color: '#5E6C84',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#F4F5F7'
            }
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || bio.length === 0 || bio.length > 500}
          sx={{
            textTransform: 'none',
            bgcolor: '#0052CC',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              bgcolor: '#0065FF'
            },
            '&:disabled': {
              bgcolor: '#DFE1E6'
            }
          }}
        >
          {saving ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BioEditDialog
