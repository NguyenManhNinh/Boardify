import { Box, Avatar, Typography } from '@mui/material';

/**
 * Activity comment item in timeline style
 * Displays user avatar, name, timestamp, and comment content
 */
function ActivityCommentItem({ comment }) {
  // Format time ago (simple implementation without date-fns for now)
  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const commentDate = new Date(createdAt);
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return commentDate.toLocaleDateString('vi-VN');
  };

  return (
    <Box sx={{ px: 0, py: 0.5 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <Avatar
          src={comment.user?.avatar}
          alt={comment.user?.displayName || 'User'}
          sx={{ width: 32, height: 32, mt: 0.5 }}
        />

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Header: Name + Time */}
          <Box sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 1,
            mb: 0.5,
            flexWrap: 'wrap'
          }}>
            <Typography sx={{
              fontWeight: 700,
              fontSize: '14px',
              color: 'text.primary'
            }}>
              {comment.user?.displayName || 'Unknown User'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '12px'
              }}
            >
              {getTimeAgo(comment.createdAt)}
            </Typography>
          </Box>

          {/* Comment Text */}
          <Box sx={{
            p: 1.5,
            bgcolor: 'background.default', // Subtle background for comment bubble
            borderRadius: 2,
            borderTopLeftRadius: 0, // Chat bubble effect
            display: 'inline-block',
            maxWidth: '100%'
          }}>
            <Typography sx={{
              fontSize: '14px',
              lineHeight: 1.5,
              color: 'text.primary',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {comment.content}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ActivityCommentItem;
