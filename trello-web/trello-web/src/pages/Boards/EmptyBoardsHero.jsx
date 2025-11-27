import { motion } from 'framer-motion'
import { Box, Typography, Button, Paper, Stack, Chip, Avatar, AvatarGroup } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PersonIcon from '@mui/icons-material/Person'
import { useState } from 'react'
import { useAuth } from '~/customHooks/useAuthContext'
import CreateBoardDialog from '~/components/Board/CreateBoardDialog'
import CreateBoardFromTemplateDialog from '~/components/Board/CreateBoardFromTemplateDialog'

export const EmptyBoardsHero = () => {
  const { user } = useAuth()
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false)

  const benefits = [
    'Tạo board trong 10 giây',
    'Giao việc, đặt hạn, nhắc lịch'
  ]

  // Mock Kanban board data for preview
  const mockColumns = [
    {
      title: 'Cần làm',
      color: '#ebf3fb',
      cards: [
        { title: 'Thiết kế UI', label: 'Design', labelColor: '#7bc86c' },
        { title: 'Setup database', label: 'Backend', labelColor: '#0079bf' }
      ]
    },
    {
      title: 'Đang làm',
      color: '#fef5e7',
      cards: [
        { title: 'Fix bug #123', label: 'Bug', labelColor: '#eb5a46', avatar: true }
      ]
    },
    {
      title: 'Hoàn thành',
      color: '#edf7ed',
      cards: [
        { title: 'Họp sprint', label: 'Meeting', labelColor: '#c377e0', avatar: true }
      ]
    }
  ]

  return (
    <>
      <Box
        sx={{
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: { xs: 6, md: 10 },
          pb: { xs: 4, md: 6 },
          px: { xs: 2, md: 3 }
        }}
      >
        <Box
          sx={{
            maxWidth: 1100,
            width: '100%',
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
            alignItems: 'center',
            gap: { xs: 3, md: 7 },
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : 'white'),
            boxShadow: (theme) => (theme.palette.mode === 'dark' ? '0 12px 24px rgba(0, 0, 0, 0.2)' : '0 12px 24px rgba(15, 23, 42, 0.08)')
          }}
        >
          {/* Left: Mini Kanban Board Preview */}
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#fafbfc'),
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#e0e0e0'),
                  transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 16px 30px rgba(15,23,42,0.12)'
                  }
                }}
              >
                {/* Board Title Bar */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Sprint hiện tại
                  </Typography>
                  <AvatarGroup
                    max={3}
                    sx={{
                      '& .MuiAvatar-root': {
                        width: 20,
                        height: 20,
                        fontSize: '0.65rem',
                        border: '1.5px solid white'
                      }
                    }}
                  >
                    <Avatar sx={{ bgcolor: '#0052cc', fontSize: '0.6rem' }}>N</Avatar>
                    <Avatar sx={{ bgcolor: '#36b37e', fontSize: '0.6rem' }}>A</Avatar>
                    <Avatar sx={{ bgcolor: '#ff7452', fontSize: '0.6rem' }}>M</Avatar>
                  </AvatarGroup>
                </Box>

                {/* Columns */}
                <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', maxWidth: '100%' }}>
                  {mockColumns.map((column, colIndex) => (
                    <motion.div
                      key={colIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + colIndex * 0.1 }}
                      style={{ flex: '0 0 130px' }}
                    >
                      <Box
                        sx={{
                          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : column.color),
                          borderRadius: 1.5,
                          p: 1.5
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            display: 'block',
                            mb: 1,
                            fontSize: '0.7rem'
                          }}
                        >
                          {column.title}
                        </Typography>

                        {column.cards.map((card, cardIndex) => (
                          <motion.div
                            key={cardIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + colIndex * 0.1 + cardIndex * 0.1 }}
                          >
                            <Paper
                              sx={{
                                p: 1,
                                mb: 1,
                                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : 'white'),
                                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                cursor: 'pointer',
                                transition: 'transform 0.12s, box-shadow 0.12s',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.12)'
                                }
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: '0.65rem',
                                  color: 'text.primary',
                                  display: 'block',
                                  mb: 0.5,
                                  lineHeight: 1.3
                                }}
                              >
                                {card.title}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                <Chip
                                  label={card.label}
                                  size="small"
                                  sx={{
                                    height: 16,
                                    fontSize: '0.55rem',
                                    bgcolor: card.labelColor,
                                    color: 'white',
                                    '& .MuiChip-label': { px: 0.5 }
                                  }}
                                />
                                {card.avatar && (
                                  <Box
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: '50%',
                                      bgcolor: '#0052cc',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <PersonIcon sx={{ fontSize: 9, color: 'white' }} />
                                  </Box>
                                )}
                              </Box>
                            </Paper>
                          </motion.div>
                        ))}

                        {/* "Add card" footer */}
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.65rem',
                            color: 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.5,
                            opacity: 0.6
                          }}
                        >
                          <AddIcon sx={{ fontSize: 12 }} />
                          Thêm thẻ
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </Box>

          {/* Right: Content */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Personalized greeting */}
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  mb: 1,
                  fontWeight: 400
                }}
              >
                Xin chào, {user?.displayName || user?.username || 'bạn'} 👋
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: 'text.primary',
                  mb: 1,
                  fontSize: { xs: '1.35rem', md: '1.85rem' },
                  letterSpacing: '-0.02em'
                }}
              >
                Bắt đầu với bảng đầu tiên
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                  fontSize: '0.9rem'
                }}
              >
                Bạn chưa có bảng nào. Bắt đầu với bảng đầu tiên để quản lý công việc của mình.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  maxWidth: 420
                }}
              >
                Tạo bảng, kéo–thả thẻ và mời thành viên trong vài giây.
              </Typography>

              {/* Benefits - with more spacing */}
              <Stack spacing={1.5} sx={{ mb: 4 }}>
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleIcon
                        sx={{
                          color: '#7bc86c',
                          fontSize: 18
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                        {benefit}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Stack>

              {/* CTAs with better micro-interactions */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreateDialog(true)}
                    sx={{
                      bgcolor: '#0052cc',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1.2,
                      fontSize: '0.9rem',
                      borderRadius: 1.5,
                      boxShadow: '0 1px 3px rgba(0, 82, 204, 0.3)',
                      transition: 'transform 0.12s ease-out, box-shadow 0.12s ease-out',
                      '&:hover': {
                        bgcolor: '#0065ff',
                        boxShadow: '0 4px 12px rgba(0, 82, 204, 0.4)',
                        transform: 'translateY(-1px)'
                      },
                      '&:active': {
                        transform: 'translateY(0)'
                      },
                      '&:focus-visible': {
                        outline: '2px solid #2684FF',
                        outlineOffset: 2
                      },
                      '&:focus': {
                        outline: '2px solid rgba(0, 82, 204, 0.5)',
                        outlineOffset: '2px'
                      }
                    }}
                  >
                    Tạo bảng đầu tiên
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<DashboardCustomizeIcon />}
                    onClick={() => setOpenTemplateDialog(true)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1.2,
                      fontSize: '0.9rem',
                      borderRadius: 1.5,
                      borderColor: '#dfe1e6',
                      color: 'text.secondary',
                      transition: 'transform 0.12s ease-out, border-color 0.12s ease-out',
                      '&:hover': {
                        borderColor: '#0052cc',
                        color: '#0052cc',
                        bgcolor: 'rgba(0, 82, 204, 0.04)',
                        transform: 'translateY(-1px)'
                      },
                      '&:active': {
                        transform: 'translateY(0)'
                      },
                      '&:focus-visible': {
                        outline: '2px solid #2684FF',
                        outlineOffset: 2
                      }
                    }}
                  >
                    Chọn từ mẫu
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Box>

      <CreateBoardDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      />

      <CreateBoardFromTemplateDialog
        open={openTemplateDialog}
        onClose={() => setOpenTemplateDialog(false)}
      />
    </>
  )
}
