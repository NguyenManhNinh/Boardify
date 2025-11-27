import { useState, useEffect, useRef } from 'react'
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import AppsIcon from '@mui/icons-material/Apps';
import TrelloIcon from '~/assets/mdi--trello.svg?react'
import SvgIcon from '@mui/material/SvgIcon'
import MyBoards from './Menus/MyBoards'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import TemplatesMenu from './Menus/TemplatesMenu'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import QueueIcon from '@mui/icons-material/Queue';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '~/customHooks/useAuthContext'
import { AuthButtons } from './AuthButtons'
import { UserMenu } from './UserMenu'
import { selectCurrentBoard } from '~/redux/board/boardSlice'
import { showCardDetailModal } from '~/redux/activeCard/activeCardSlice'
import SearchResults from './SearchResults'
import Notifications from './Menus/Notifications'
import HelpDialog from './HelpDialog'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import CreateBoardDialog from '~/components/Board/CreateBoardDialog'

function AppBar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const board = useSelector(selectCurrentBoard)

  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [openCreateBoard, setOpenCreateBoard] = useState(false)

  const [mobileOpen, setMobileOpen] = useState(false)
  const searchRef = useRef(null)

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, p: 2, justifyContent: 'center' }}>
        <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color: 'white' }} />
        <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: "bold", color: 'white' }}>Boardify</Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List>
        <ListItem disablePadding sx={{ display: 'block', p: 1 }}>
          <MyBoards />
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block', p: 1 }}>
          <Recent />
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block', p: 1 }}>
          <Starred />
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block', p: 1 }}>
          <TemplatesMenu />
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block', p: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              color: 'white',
              borderColor: 'white',
              textTransform: 'none',
              justifyContent: 'flex-start',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
            startIcon={<QueueIcon />}
            onClick={() => setOpenCreateBoard(true)}
          >
            Tạo bảng
          </Button>
        </ListItem>
      </List>
    </Box>
  )

  // ... (rest of the file)




  const handleLoginClick = () => {
    navigate('/auth')
  }

  const handleSignUpClick = () => {
    navigate('/auth')
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const timeoutId = setTimeout(() => {
      performSearch(searchValue)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchValue, board])

  const performSearch = (query) => {
    if (!board?.columns) return

    const results = []
    const lowerQuery = query.toLowerCase()

    board.columns.forEach((column) => {
      column.cards.forEach((card) => {
        // Skip placeholder cards
        if (card._id.includes('placeholder-card')) return

        if (card.title.toLowerCase().includes(lowerQuery)) {
          results.push({
            card,
            columnTitle: column.title,
            columnId: column._id
          })
        }
      })
    })

    setSearchResults(results)
    setShowResults(true)
  }

  const handleCardClick = (result) => {
    // Open the card modal
    dispatch(showCardDetailModal(result.card))

    // Close search
    setShowResults(false)
    setSearchValue('')
  }

  return (
    <>
      <Box
        px={2}
        sx={{
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          overflowX: 'auto',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'),
          px: 2,
          flexShrink: 0
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon sx={{ color: 'white' }} />
          </IconButton>

          <AppsIcon sx={{ color: 'white', display: { xs: 'none', md: 'block' } }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color: 'white' }} />
            <Typography variant='span' sx={{ fontSize: '1.3rem', fontWeight: "bold", color: 'white' }}>Boardify</Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <MyBoards />
            <Recent />
            <Starred />
            <TemplatesMenu />
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
              startIcon={<QueueIcon />}
              onClick={() => setOpenCreateBoard(true)}
            >
              Tạo bảng
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ModeSelect />

          <Box sx={{ position: 'relative' }} ref={searchRef}>
            <TextField
              id="outlined-search"
              label="Search..."
              type="text"
              size='small'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => searchValue && setShowResults(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchResults.length > 0) {
                  handleCardClick(searchResults[0])
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "white" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <CloseIcon
                      fontSize='small'
                      sx={{ color: searchValue ? 'white' : 'transparent', cursor: 'pointer' }}
                      onClick={() => {
                        setSearchValue('')
                        setShowResults(false)
                      }}
                    />
                  </InputAdornment>
                )
              }}
              sx={{
                minWidth: '120px',
                maxWidth: '190px',
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  boxShadow: 'none',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white', },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white', },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white', },
                  '& .Mui-focused fieldset': { color: 'white' }
                }
              }}
            />

            {showResults && searchValue && (
              <SearchResults
                results={searchResults}
                onCardClick={handleCardClick}
              />
            )}
          </Box>

          {!user ? (
            <>
              <Tooltip title="Help" sx={{ cursor: 'pointer' }}>
                <HelpOutlineIcon sx={{ color: 'error.main' }} />
              </Tooltip>

              <AuthButtons
                onLoginClick={handleLoginClick}
                onSignUpClick={handleSignUpClick}
              />
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: -2 }}>
              <Notifications />

              <HelpDialog />

              <UserMenu />
            </Box>
          )}
        </Box>
      </Box>


      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'),
            color: 'white'
          },
        }}
      >
        {drawer}
      </Drawer>

      <CreateBoardDialog
        open={openCreateBoard}
        onClose={() => setOpenCreateBoard(false)}
      />
    </>
  )
}

export default AppBar
