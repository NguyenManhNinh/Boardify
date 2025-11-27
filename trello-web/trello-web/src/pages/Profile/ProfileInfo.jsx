import { useState } from 'react'
import { Box, Grid, Typography, Paper, Divider, Button, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import ProfileOverviewStats from './ProfileOverviewStats'
import ProfileRecentActivity from './ProfileRecentActivity'
import ProfileQuickActions from './ProfileQuickActions'
import BioEditDialog from './BioEditDialog'
import { updateBio } from '~/services/profileService'

export const ProfileInfo = ({ user, onUpdateUser }) => {
    const [bioDialogOpen, setBioDialogOpen] = useState(false)

    if (!user) return null

    // Check if bio is empty or placeholder
    const isBioEmpty = !user.bio || user.bio === 'New'

    const handleSaveBio = async (newBio) => {
        try {
            const result = await updateBio(newBio)
            // Update user data in parent component if callback exists
            if (onUpdateUser && result.data) {
                onUpdateUser(result.data)
            } else {
                // Fallback: reload page to see changes if no callback
                window.location.reload()
            }
        } catch (error) {
            console.error('Error updating bio:', error)
            // You might want to show a toast error here
        }
    }

    return (
        <Box>
            {/* 1. Statistics Section */}
            <ProfileOverviewStats user={user} />

            <Grid container spacing={3}>
                {/* 2. Main Content Column (Left) */}
                <Grid item xs={12} md={8}>
                    {/* Recent Activity */}
                    <Box sx={{ mb: 4 }}>
                        <ProfileRecentActivity />
                    </Box>

                    {/* About Me / Bio Section */}
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>Giới thiệu về tôi</Typography>
                        {!isBioEmpty && (
                            <IconButton
                                size="small"
                                onClick={() => setBioDialogOpen(true)}
                                sx={{
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: 'rgba(0,82,204,0.08)',
                                        transform: 'rotate(15deg)'
                                    }
                                }}
                            >
                                <EditIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            </IconButton>
                        )}
                    </Box>

                    {!isBioEmpty ? (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '12px',
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    borderColor: 'text.secondary',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.primary',
                                    lineHeight: 1.7,
                                    fontSize: '1rem',
                                    maxWidth: '70ch',
                                    whiteSpace: 'pre-line'
                                }}
                            >
                                {user.bio}
                            </Typography>
                        </Paper>
                    ) : (
                        // Empty State for Bio
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: '12px',
                                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#FAFBFC'),
                                border: '2px dashed',
                                borderColor: 'divider',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(135deg, rgba(0,82,204,0.03) 0%, rgba(102,126,234,0.03) 100%)',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                },
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,82,204,0.08)',
                                    '&::before': {
                                        opacity: 1
                                    }
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    background: (theme) => (theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' : 'linear-gradient(135deg, #F4F5F7 0%, #EBECF0 100%)'),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                <InfoOutlinedIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
                            </Box>

                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    mb: 1,
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                Giới thiệu bản thân
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 2.5,
                                    maxWidth: '400px',
                                    lineHeight: 1.6,
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                Giúp mọi người hiểu rõ hơn về bạn bằng cách thêm một đoạn tiểu sử ngắn về bản thân.
                            </Typography>

                            <Button
                                variant="contained"
                                size="medium"
                                startIcon={<EditIcon />}
                                onClick={() => setBioDialogOpen(true)}
                                sx={{
                                    textTransform: 'none',
                                    bgcolor: '#0052CC',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1,
                                    borderRadius: '8px',
                                    boxShadow: 'none',
                                    position: 'relative',
                                    zIndex: 1,
                                    '&:hover': {
                                        bgcolor: '#0065FF',
                                        boxShadow: '0 4px 12px rgba(0,82,204,0.3)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Thêm tiểu sử
                            </Button>
                        </Paper>
                    )}
                </Grid>

                {/* 3. Sidebar Column (Right) */}
                <Grid item xs={12} md={4}>
                    {/* Quick Actions */}
                    <Box sx={{ mb: 4 }}>
                        <ProfileQuickActions />
                    </Box>

                    {/* Account Details */}
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>Chi tiết</Typography>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '4px',
                                height: '100%',
                                background: 'linear-gradient(180deg, #667EEA 0%, #764BA2 100%)',
                            },
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                borderColor: 'text.secondary',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            }
                        }}
                    >
                        <Box sx={{ mb: 2.5 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.secondary',
                                    fontSize: '0.6875rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                ĐÃ THAM GIA
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.primary',
                                    mt: 0.75,
                                    fontWeight: 600,
                                    fontSize: '0.9375rem'
                                }}
                            >
                                {new Date(user.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2.5, opacity: 0.6 }} />

                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.secondary',
                                    fontSize: '0.6875rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                LOẠI TÀI KHOẢN
                            </Typography>
                            <Box sx={{ mt: 0.75, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                    sx={{
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: '12px',
                                        bgcolor: 'rgba(0,82,204,0.08)',
                                        border: '1px solid rgba(0,82,204,0.2)',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#0052CC',
                                            fontWeight: 600,
                                            fontSize: '0.8125rem'
                                        }}
                                    >
                                        {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Bio Edit Dialog */}
            <BioEditDialog
                open={bioDialogOpen}
                onClose={() => setBioDialogOpen(false)}
                currentBio={user.bio === 'New' ? '' : user.bio}
                onSave={handleSaveBio}
            />
        </Box>
    )
}