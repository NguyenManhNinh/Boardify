import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, FormControl,
  FormLabel, RadioGroup, Radio, FormControlLabel,
  Alert, CircularProgress, useTheme, useMediaQuery
} from '@mui/material'
import { createBoard } from '~/services/boardsService'
import { addBoard } from '~/redux/board/boardSlice'

export const BOARD_COLORS = [
  { value: '#0c66e4', label: 'Xanh dương' },
  { value: '#7bc86c', label: 'Xanh lá' },
  { value: '#f5dd29', label: 'Vàng' },
  { value: '#ef7564', label: 'Đỏ' },
  { value: '#cd8de5', label: 'Tím' },
  { value: '#00c2e0', label: 'Xanh ngọc' },
  { value: '#ff8ed4', label: 'Hồng' },
  { value: '#344563', label: 'Xám đen' }
]

function CreateBoardDialog({ open, onClose }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [background, setBackground] = useState('#0c66e4')
  const [visibility, setVisibility] = useState('public')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [titleError, setTitleError] = useState('')

  // Load last used color from localStorage
  useEffect(() => {
    const savedColor = localStorage.getItem('lastBoardColor')
    if (savedColor) {
      setBackground(savedColor)
    }
  }, [])

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('')
      setDescription('')
      // Keep last color (don't reset)
      setVisibility('public')
      setError('')
      setTitleError('')
      onClose()
    }
  }

  const handleSubmit = async () => {
    // Validate title
    if (!title.trim()) {
      setTitleError('Vui lòng nhập tên bảng')
      return
    }

    setIsSubmitting(true)
    setError('')
    setTitleError('')

    try {
      const response = await createBoard({
        title: title.trim(),
        description: description.trim() || 'Bảng quản lý công việc',
        background,
        type: visibility === 'public' ? 'public' : 'private'
      })

      // Save color for next time
      localStorage.setItem('lastBoardColor', background)

      const newBoard = response.data || response
      dispatch(addBoard(newBoard))
      handleClose()
      navigate(`/boards/${newBoard._id}`)
    } catch (err) {
      setError('Không thể tạo bảng, vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <DialogTitle>Tạo bảng mới</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Thiết lập nhanh bảng mới để quản lý công việc của bạn.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Preview Board */}
        <Box
          sx={{
            width: '100%',
            height: 60,
            borderRadius: 2,
            background: background,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 2,
            border: '2px solid',
            borderColor: 'divider'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 600,
              textShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}
          >
            {title || 'Tên bảng của bạn'}
          </Typography>
        </Box>

        {/* Title */}
        <TextField
          autoFocus
          fullWidth
          label="Tên bảng"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (titleError) setTitleError('')
          }}
          onKeyPress={handleKeyPress}
          error={!!titleError}
          helperText={titleError}
          sx={{ mb: 2 }}
        />

        {/* Description */}
        <TextField
          fullWidth
          label="Mô tả (tuỳ chọn)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          rows={2}
          sx={{ mb: 3 }}
        />

        {/* Color Picker */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel>Màu nền</FormLabel>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {BOARD_COLORS.map((color) => (
              <Box
                key={color.value}
                onClick={() => setBackground(color.value)}
                sx={{
                  width: 48,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: color.value,
                  cursor: 'pointer',
                  border: background === color.value ? '3px solid' : '2px solid transparent',
                  borderColor: background === color.value ? 'primary.main' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
                title={color.label}
              />
            ))}
          </Box>
        </FormControl>

        {/* Visibility */}
        <FormControl fullWidth>
          <FormLabel>Quyền xem</FormLabel>
          <RadioGroup value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <FormControlLabel
              value="private"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Riêng tư</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Chỉ mình bạn xem được
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="public"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Công khai</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ai có link đều xem được
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!title.trim() || isSubmitting}
          startIcon={isSubmitting && <CircularProgress size={20} />}
        >
          {isSubmitting ? 'Đang tạo...' : 'Tạo bảng'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateBoardDialog
