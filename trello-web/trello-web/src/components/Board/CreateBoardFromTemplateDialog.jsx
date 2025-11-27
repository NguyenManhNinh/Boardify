import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, FormControl,
  FormLabel, RadioGroup, Radio, FormControlLabel,
  Alert, CircularProgress, Grid, Card, CardContent, CardActionArea, Chip, IconButton
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { createBoard } from '~/services/boardsService'
import { createNewColumnApi, createNewCardApi } from '~/apis'
import { addBoard } from '~/redux/board/boardSlice'
import { BOARD_COLORS } from '~/components/Board/CreateBoardDialog'
import { BOARD_TEMPLATES } from '~/utilities/boardTemplates'

function CreateBoardFromTemplateDialog({ open, onClose, template: initialTemplate }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate || null)
  const [step, setStep] = useState(initialTemplate ? 2 : 1)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [background, setBackground] = useState('#0c66e4')
  const [visibility, setVisibility] = useState('public')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [titleError, setTitleError] = useState('')

  // Reset state when dialog opens/closes or initialTemplate changes
  useEffect(() => {
    if (open) {
      if (initialTemplate) {
        setSelectedTemplate(initialTemplate)
        setStep(2)
      } else {
        setSelectedTemplate(null)
        setStep(1)
      }
      // Reset form fields
      setTitle('')
      setDescription('')
      setBackground('#0c66e4')
      setVisibility('public')
      setError('')
      setTitleError('')
    }
  }, [open, initialTemplate])

  // Set form values when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate) {
      setTitle(selectedTemplate.name)
      setDescription(selectedTemplate.description)
      setBackground(selectedTemplate.thumbnailColor || '#0c66e4')
    }
  }, [selectedTemplate])

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setStep(2)
  }

  const handleBackToSelection = () => {
    setStep(1)
    setSelectedTemplate(null)
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError('Vui lòng nhập tên bảng')
      return
    }

    setIsSubmitting(true)
    setError('')
    setTitleError('')

    try {
      // 1. Create Board
      const response = await createBoard({
        title: title.trim(),
        description: description.trim(),
        background,
        type: visibility === 'public' ? 'public' : 'private'
      })
      const newBoard = response.data || response

      // 2. Create Columns & Cards from Template
      if (selectedTemplate?.columns) {
        for (const col of selectedTemplate.columns) {
          const newColumn = await createNewColumnApi({
            boardId: newBoard._id,
            title: col.title
          })

          if (col.cards && col.cards.length > 0) {
            for (const cardTitle of col.cards) {
              await createNewCardApi({
                boardId: newBoard._id,
                columnId: newColumn._id,
                title: cardTitle
              })
            }
          }
        }
      }

      // 3. Finish
      dispatch(addBoard(newBoard))
      handleClose()
      navigate(`/boards/${newBoard._id}`)
    } catch (err) {
      console.error('Error creating board from template:', err)
      setError('Không thể tạo bảng từ mẫu, vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {step === 2 && !initialTemplate && (
          <IconButton onClick={handleBackToSelection} size="small" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        {step === 1 ? 'Chọn mẫu bảng' : 'Tạo bảng từ mẫu'}
      </DialogTitle>

      <DialogContent>
        {step === 1 ? (
          // Step 1: Template Selection
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {BOARD_TEMPLATES.map((tpl) => (
              <Grid item xs={12} sm={6} md={4} key={tpl.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardActionArea
                    onClick={() => handleSelectTemplate(tpl)}
                    sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: 40,
                        bgcolor: tpl.thumbnailColor,
                        borderRadius: 1,
                        mb: 2
                      }}
                    />
                    <Typography variant="h6" component="div" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      {tpl.name}
                    </Typography>
                    <Chip label={tpl.category} size="small" sx={{ mb: 1.5, height: 20, fontSize: '0.7rem' }} />
                    <Typography variant="body2" color="text.secondary" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {tpl.description}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          // Step 2: Customize & Create
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Thiết lập nhanh bảng mới dựa trên mẫu <strong>{selectedTemplate?.name}</strong>.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={3}>
              {/* Left Side: Form */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    autoFocus
                    fullWidth
                    label="Tên bảng"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      if (titleError) setTitleError('')
                    }}
                    error={!!titleError}
                    helperText={titleError}
                  />

                  <TextField
                    fullWidth
                    label="Mô tả (tuỳ chọn)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={2}
                  />

                  <FormControl fullWidth>
                    <FormLabel>Màu nền</FormLabel>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      {BOARD_COLORS.map((color) => (
                        <Box
                          key={color.value}
                          onClick={() => setBackground(color.value)}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            bgcolor: color.value,
                            cursor: 'pointer',
                            border: background === color.value ? '2px solid' : '2px solid transparent',
                            borderColor: background === color.value ? 'primary.main' : 'transparent',
                            transition: 'all 0.2s',
                            '&:hover': { transform: 'scale(1.1)' }
                          }}
                          title={color.label}
                        />
                      ))}
                    </Box>
                  </FormControl>

                  <FormControl fullWidth>
                    <FormLabel>Quyền xem</FormLabel>
                    <RadioGroup row value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                      <FormControlLabel value="private" control={<Radio size="small" />} label="Riêng tư" />
                      <FormControlLabel value="public" control={<Radio size="small" />} label="Công khai" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Grid>

              {/* Right Side: Preview */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#f4f5f7'),
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Xem trước cấu trúc: {selectedTemplate?.name}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, flex: 1 }}>
                    {selectedTemplate?.columns.map((col, index) => (
                      <Box
                        key={index}
                        sx={{
                          minWidth: 120,
                          width: 120,
                          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#ebecf0'),
                          borderRadius: 1.5,
                          p: 1,
                          height: 'fit-content'
                        }}
                      >
                        <Typography variant="caption" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                          {col.title}
                        </Typography>
                        {col.cards.slice(0, 3).map((card, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#455a64' : 'white'),
                              p: 0.5,
                              mb: 0.5,
                              borderRadius: 1,
                              fontSize: '0.7rem',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              cursor: 'default'
                            }}
                          >
                            {card}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                    * Cấu trúc cột và thẻ sẽ được tạo tự động
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Hủy
        </Button>
        {step === 2 && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} />}
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo từ mẫu'}
          </Button>
        )}
      </DialogActions>
    </Dialog >
  )
}

export default CreateBoardFromTemplateDialog
