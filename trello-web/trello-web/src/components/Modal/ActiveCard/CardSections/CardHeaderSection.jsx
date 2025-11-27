import { Box, Typography, InputBase, Chip, Avatar, AvatarGroup, IconButton, Grid, Stack, Checkbox, FormControlLabel } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CloseIcon from '@mui/icons-material/Close';
import ListIcon from '@mui/icons-material/List';
import { useState, useEffect } from 'react';
import { useAuth } from '~/customHooks/useAuthContext';

function CardHeaderSection({ card, onUpdateTitle, onClose, columnTitle, boardTitle, onToggleDone }) {
  const [title, setTitle] = useState(card?.title || '');
  const { user } = useAuth()

  useEffect(() => {
    setTitle(card?.title || '');
  }, [card?.title]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBlur = () => {
    if (title !== card.title) {
      onUpdateTitle(title);
    }
  };

  const handleToggleDone = (e) => {
    if (onToggleDone) {
      onToggleDone(e.target.checked);
    }
  };

  const totalChecklistItems = card?.checklists?.reduce((acc, c) => acc + c.items.length, 0) || 0;
  const completedItems = card?.checklists?.reduce((acc, c) => acc + c.items.filter(i => i.isChecked).length, 0) || 0;

  // Check if status bar has any data to display
  const hasLabels = card?.labels?.length > 0;
  const hasMembers = card?.memberIds?.length > 0;
  const hasDueDate = !!card?.dueDate;
  const hasChecklist = totalChecklistItems > 0;

  // Helper to get user display name
  const getUserDisplayInfo = (userId) => {
    // For now, check if it's current user
    if (user && user.id === userId) {
      return {
        name: user.displayName || user.username || user.email || 'User',
        initials: (user.displayName || user.username || user.email || 'U').charAt(0).toUpperCase()
      }
    }
    // Fallback for other users (future: fetch from API)
    return {
      name: 'User',
      initials: 'U'
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Top Row: Breadcrumb & Close Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ListIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '14px'
            }}
          >
            Danh sách: <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{columnTitle || 'Unknown'}</Box>
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': { bgcolor: 'grey.100', color: 'text.primary' }
          }}
          aria-label="Đóng thẻ"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Card Title */}
      <Box sx={{ mb: 3, ml: -1 }}>
        <InputBase
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          fullWidth
          multiline
          sx={{
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: 1.2,
            color: 'text.primary',
            padding: '4px 8px',
            borderRadius: '4px',
            '&.Mui-focused': {
              bgcolor: 'background.paper',
              boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`
            },
            '&:hover': {
              bgcolor: 'grey.50'
            }
          }}
        />

        {/* Mark as Done Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={card?.isDone || false}
              onChange={handleToggleDone}
              sx={{
                color: 'success.main',
                '&.Mui-checked': {
                  color: 'success.main',
                }
              }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{
                color: card?.isDone ? 'success.main' : 'text.secondary',
                fontWeight: card?.isDone ? 600 : 400
              }}
            >
              {card?.isDone ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
            </Typography>
          }
          sx={{
            mt: 1,
            ml: 0,
            '& .MuiFormControlLabel-label': {
              ml: 0.5
            }
          }}
        />
      </Box>

      {/* Meta Data Section */}
      {(hasMembers || hasLabels || hasDueDate || hasChecklist) && (
        <Grid container spacing={3}>
          {/* Members */}
          {hasMembers && (
            <Grid item>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: '11px' }}>
                Thành viên
              </Typography>
              <AvatarGroup max={4} sx={{ justifyContent: 'flex-start', '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 14, border: 'none' } }}>
                {card.memberIds.map((memberId) => {
                  const userInfo = getUserDisplayInfo(memberId)
                  return (
                    <Avatar key={memberId} sx={{ width: 32, height: 32, bgcolor: 'primary.main' }} title={userInfo.name}>
                      {userInfo.initials}
                    </Avatar>
                  )
                })}
              </AvatarGroup>
            </Grid>
          )}

          {/* Labels */}
          {hasLabels && (
            <Grid item>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: '11px' }}>
                Nhãn
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {card.labels.map((label, index) => (
                  <Chip
                    key={index}
                    label={label.text}
                    size="medium"
                    sx={{
                      bgcolor: label.color,
                      color: '#fff',
                      fontWeight: 500,
                      border: 'none',
                      borderRadius: '4px',
                      height: '32px',
                      '&:hover': { opacity: 0.9 }
                    }}
                  />
                ))}
              </Stack>
            </Grid>
          )}

          {/* Due Date */}
          {hasDueDate && (
            <Grid item>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: '11px' }}>
                Ngày hết hạn
              </Typography>
              {(() => {
                const now = Date.now();
                const dueDate = new Date(card.dueDate).getTime();
                const hoursDiff = (dueDate - now) / (1000 * 60 * 60);

                const isOverdue = dueDate < now;
                const isDueSoon = !isOverdue && hoursDiff <= 24;

                const bgColor = isOverdue ? '#eb5a46' : isDueSoon ? '#f2d600' : '#091e420f';
                const textColor = isOverdue ? '#fff' : isDueSoon ? '#172b4d' : '#626f86';

                return (
                  <Chip
                    icon={<AccessTimeIcon sx={{ color: `${textColor} !important` }} />}
                    label={new Date(card.dueDate).toLocaleDateString('vi-VN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    size="small"
                    sx={{
                      bgcolor: bgColor,
                      color: textColor,
                      fontWeight: isOverdue || isDueSoon ? 600 : 500,
                      fontSize: '13px',
                      '& .MuiChip-label': {
                        px: 1
                      }
                    }}
                  />
                );
              })()}
            </Grid>
          )}

          {/* Checklist Summary */}
          {hasChecklist && (
            <Grid item>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', fontSize: '11px' }}>
                Checklist
              </Typography>
              <Chip
                icon={<ChecklistIcon fontSize="small" />}
                label={`${completedItems}/${totalChecklistItems}`}
                sx={{
                  bgcolor: 'grey.100',
                  color: 'text.primary',
                  borderRadius: '4px',
                  height: '32px',
                  fontWeight: 500,
                  border: 'none'
                }}
              />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default CardHeaderSection;
