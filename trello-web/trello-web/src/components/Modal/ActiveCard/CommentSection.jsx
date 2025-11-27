import { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';
import { useAuth } from '~/customHooks/useAuthContext';
import ActivityCommentItem from './CardSections/ActivityCommentItem';
import ActivityEmptyState from './CardSections/ActivityEmptyState';

function CommentSection({ card, onUpdate }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      userId: user?._id,
      userEmail: user?.email,
      user: {
        avatar: user?.avatar,
        displayName: user?.displayName || user?.email
      },
      content: commentText,
      createdAt: Date.now()
    };

    const newComments = [newComment, ...(card.comments || [])];
    onUpdate({ comments: newComments });
    setCommentText('');
    setIsFocused(false);
  };

  const handleCancelComment = () => {
    setCommentText('');
    setIsFocused(false);
  };

  return (
    <Box>
      {/* Comment Input */}
      <Box sx={{ px: 0, pb: 3, display: 'flex', gap: 2 }}>
        <Avatar
          src={user?.avatar}
          sx={{ width: 32, height: 32, mt: 0.5 }}
        />

        <Box sx={{ flex: 1 }}>
          {!isFocused ? (
            // Collapsed State
            <Box
              onClick={() => setIsFocused(true)}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                border: '1px solid',
                borderColor: 'divider',
                p: '8px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                  borderColor: 'text.disabled'
                }
              }}
            >
              <Typography color="text.secondary" fontSize="14px">
                Viết bình luận...
              </Typography>
            </Box>
          ) : (
            // Expanded State
            <Box sx={{
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}>
              <TextField
                multiline
                minRows={3}
                fullWidth
                autoFocus
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (commentText.trim()) handleAddComment();
                  }
                }}
                placeholder="Viết bình luận..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: 14,
                    p: 1.5,
                    '& fieldset': { border: 'none' }
                  }
                }}
              />

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'grey.50'),
                borderTop: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="caption" color="text.secondary">
                  Nhấn Ctrl+Enter để gửi
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!commentText.trim()}
                    onClick={handleAddComment}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': { boxShadow: 'none' }
                    }}
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleCancelComment}
                    sx={{
                      textTransform: 'none',
                      color: 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    Hủy
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Comments List or Empty State */}
      {!card.comments || card.comments.length === 0 ? (
        <ActivityEmptyState />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {card.comments.map((comment, index) => (
            <ActivityCommentItem key={index} comment={comment} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CommentSection;
