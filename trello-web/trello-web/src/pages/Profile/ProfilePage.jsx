import { useState, useEffect } from 'react'
import { Box, Container, Tabs, Tab, CircularProgress, Alert, Button, Typography, Avatar, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LogoutIcon from '@mui/icons-material/Logout'
import ShareIcon from '@mui/icons-material/Share'

// Icons cho Tabs
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'

// import AppBar from '~/components/AppBar/AppBar'
import { useAuth } from '~/customHooks/useAuthContext'
import { getProfile, updateAvatar, changePassword } from '~/services/profileService'
import { getUserBoards } from '~/services/boardsService'
import { ProfileInfo } from './ProfileInfo'
import { ProfileSettings } from './ProfileSettings'
import { ProfileSecurity } from './ProfileSecurity'
import { getRecentBoards } from '~/utilities/recentBoards'

// Enhanced Tab Styles with better typography and interactions
const tabStyles = {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    minHeight: '48px',
    color: 'text.secondary',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&.Mui-selected': {
        color: 'primary.main',
    },
    '&:hover': {
        color: 'primary.main',
        bgcolor: (theme) => theme.palette.action.hover
    }
}

export const ProfilePage = () => {
    const navigate = useNavigate()
    const { logout, updateUser } = useAuth()
    const [tabValue, setTabValue] = useState(0)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    useEffect(() => { fetchProfile() }, [])

    const fetchProfile = async () => {
        try {
            setLoading(true)
            const data = await getProfile()
            setUser(data.data)
            // Update global user context to sync header/sidebar
            updateUser(data.data)
        } catch (err) {
            setError('Failed to load profile')
            setLoading(false)
        } finally { setLoading(false) }
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0]
        if (file) {
            // Preview immediately
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)

            try {
                // Convert to Base64
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onloadend = async () => {
                    const base64data = reader.result
                    // Call API to upload
                    await updateAvatar(base64data)
                    // Refresh profile data to ensure sync
                    await fetchProfile()
                }
            } catch (err) {
                console.error('Failed to upload avatar:', err)
                setError('Failed to upload avatar')
                // Revert preview on error
                setPreviewUrl(null)
            }
        }
    }

    const handleUpdateUser = (updatedUser) => {
        setUser(updatedUser)
        updateUser(updatedUser)
    }

    const handleChangePassword = async (oldPassword, newPassword) => {
        try {
            setLoading(true)
            await changePassword(oldPassword, newPassword)
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#F4F5F7') }}>

          {/* Sẽ import đến thanh Appbar */}
            {/* <AppBar /> */}
            {/* --- 1. ENHANCED HEADER SECTION --- */}
            <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {/* Multi-layer Gradient Background Header */}
                <Box sx={{
                    height: '180px',
                    background: 'linear-gradient(135deg, #0079BF 0%, #5067C5 50%, #667EEA 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
                        pointerEvents: 'none'
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        right: '-10%',
                        width: '40%',
                        height: '200%',
                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        transform: 'rotate(-15deg)',
                        pointerEvents: 'none'
                    }
                }}>

                    < Container maxWidth="lg" sx={{ pt: 2, position: 'relative', zIndex: 1 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={async () => {
                                const recentBoards = getRecentBoards()
                                if (recentBoards.length > 0) {
                                    navigate(`/boards/${recentBoards[0]._id}`)
                                } else {
                                    // If no local recent boards, fetch from API
                                    try {
                                        const userBoards = await getUserBoards()

                                        // Handle response structure (might be { boards: [...] } or just [...])
                                        const boards = userBoards?.data || userBoards?.boards || userBoards || []

                                        if (Array.isArray(boards) && boards.length > 0) {
                                            navigate(`/boards/${boards[0]._id}`)
                                        } else {
                                            // Really no boards, go home (or maybe create board page?)
                                            window.location.href = '/'
                                        }
                                    } catch (err) {
                                        console.error('Failed to fetch boards:', err)
                                        window.location.href = '/'
                                    }
                                }
                            }}
                            sx={{
                                color: 'white',
                                textTransform: 'none',
                                bgcolor: 'rgba(0,0,0,0.2)',
                                backdropFilter: 'blur(8px)',
                                fontWeight: 500,
                                px: 2,
                                py: 0.75,
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.3)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            Quay lại
                        </Button>
                    </Container >
                </Box >

                {/* User Identity Bar with Enhanced Avatar */}
                < Container maxWidth="lg" sx={{ position: 'relative', pb: 1 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'center', md: 'flex-end' },
                        mt: -6,
                        mb: 3,
                        gap: 3
                    }}>
                        {/* Avatar with Edit Overlay */}
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: 140,
                                    height: 140,
                                    borderRadius: '50%',
                                    border: '4px solid',
                                    borderColor: 'background.paper',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    overflow: 'hidden',
                                    bgcolor: 'background.paper',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        '& .avatar-overlay': { opacity: 1 }
                                    }
                                }}
                                onClick={() => document.getElementById('avatar-upload').click()}
                            >
                                <Avatar
                                    src={previewUrl || user?.avatar}
                                    alt={user?.displayName || user?.name}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        bgcolor: '#0052CC',
                                        fontSize: '3rem',
                                        fontWeight: 700
                                    }}
                                >
                                    {(user?.displayName || user?.name)?.charAt(0)?.toUpperCase()}
                                </Avatar>

                                {/* Edit Overlay */}
                                <Box
                                    className="avatar-overlay"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        bgcolor: 'rgba(0,0,0,0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0,
                                        transition: 'opacity 0.2s ease',
                                        backdropFilter: 'blur(2px)'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                                        Thêm avatar
                                    </Typography>
                                </Box>
                            </Box>
                            <input
                                type="file"
                                id="avatar-upload"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Box>

                        {/* User Info */}
                        <Box sx={{
                            flex: 1,
                            textAlign: { xs: 'center', md: 'left' },
                            mb: { xs: 1, md: 1 }
                        }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    color: 'text.primary',
                                    letterSpacing: '-0.5px',
                                    lineHeight: 1.2,
                                    mb: 0.5
                                }}
                            >
                                {user?.displayName || user?.name}
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                justifyContent: { xs: 'center', md: 'flex-start' },
                                color: 'text.secondary',
                                flexWrap: 'wrap'
                            }}>
                                <Typography variant="body2" fontWeight="500">{user?.username || 'username'}</Typography>
                                <Typography variant="caption">•</Typography>
                                <Typography variant="body2">{user?.email}</Typography>
                            </Box>
                        </Box>

                        {/* Enhanced Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1, mb: { xs: 0, md: 1 } }}>
                            <Button
                                variant="contained"
                                startIcon={<ShareIcon fontSize="small" />}
                                sx={{
                                    bgcolor: '#0052CC',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 2.5,
                                    py: 1,
                                    boxShadow: '0 2px 8px rgba(0,82,204,0.2)',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        bgcolor: '#0065FF',
                                        boxShadow: '0 4px 12px rgba(0,82,204,0.3)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Chia sẻ
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<LogoutIcon fontSize="small" />}
                                onClick={logout}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: '8px',
                                    borderColor: 'divider',
                                    color: 'text.primary',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                        borderColor: 'text.secondary',
                                        transform: 'translateY(-1px)'
                                    }
                                }}
                            >
                                Đăng xuất
                            </Button>
                        </Box>
                    </Box>

                    {/* Enhanced Navigation Tabs */}
                    <Tabs
                        value={tabValue}
                        onChange={(e, n) => setTabValue(n)}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: 'primary.main',
                                height: '3px',
                                borderRadius: '3px 3px 0 0'
                            }
                        }}
                    >
                        <Tab icon={<PersonOutlineIcon sx={{ mb: 0, mr: 1 }} />} iconPosition="start" label="Tổng quan" sx={tabStyles} />
                        <Tab icon={<SettingsOutlinedIcon sx={{ mb: 0, mr: 1 }} />} iconPosition="start" label="Cài đặt" sx={tabStyles} />
                        <Tab icon={<SecurityOutlinedIcon sx={{ mb: 0, mr: 1 }} />} iconPosition="start" label="Bảo vệ" sx={tabStyles} />
                    </Tabs>
                </Container >
            </Box >

            {/* --- 2. CONTENT SECTION --- */}
            < Container maxWidth="lg" sx={{ py: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box sx={{ minHeight: '400px' }}>
                    {tabValue === 0 && <ProfileInfo user={user} onUpdateUser={handleUpdateUser} />}
                    {tabValue === 1 && <ProfileSettings user={user} />}
                    {tabValue === 2 && <ProfileSecurity onChangePassword={handleChangePassword} loading={loading} />}
                </Box>
            </Container >
        </Box >
    )
}