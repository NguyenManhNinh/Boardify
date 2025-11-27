import { useState, useEffect } from 'react'
import { Box, Container, Typography, Grid, Card, CircularProgress, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import AppBar from '~/components/AppBar/AppBar'
import { getUserBoards } from '~/services/boardsService'
import CreateBoardDialog from '~/components/Board/CreateBoardDialog'
import { EmptyBoardsHero } from './EmptyBoardsHero'

export const BoardsList = () => {
  const navigate = useNavigate()
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      setLoading(true)
      const response = await getUserBoards()
      const boardsData = response?.data || response?.boards || response || []
      setBoards(Array.isArray(boardsData) ? boardsData : [])
    } catch (error) {
      console.error('Failed to fetch boards:', error)
      setBoards([])
    } finally {
      setLoading(false)
    }
  }

  const handleBoardClick = (boardId) => {
    navigate(`/boards/${boardId}`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f5f7' }}>
      <AppBar />

      {boards.length === 0 ? (
        // Enhanced empty state with hero
        <EmptyBoardsHero onOpenCreateBoard={() => setOpenCreateDialog(true)} />
      ) : (
        // Boards grid for existing users
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#172b4d' }}>
              Bảng của tôi
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
              sx={{
                bgcolor: '#0052cc',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { bgcolor: '#0065ff' }
              }}
            >
              Tạo bảng mới
            </Button>
          </Box>

          <Grid container spacing={3}>
            {boards.map((board) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={board._id}>
                <Card
                  onClick={() => handleBoardClick(board._id)}
                  sx={{
                    height: 120,
                    background: board.background || '#0079bf',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                      }}
                    >
                      {board.title}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      <CreateBoardDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      />
    </Box>
  )
}
