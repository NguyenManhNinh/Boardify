import { Box, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

/**
 * Empty state for activity section
 * Shows when there are no comments or activities yet
 */
function ActivityEmptyState() {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{ px: 3, py: 4, textAlign: 'center' }}
    >
      <ChatBubbleOutlineIcon
        sx={{
          fontSize: 48,
          color: 'text.disabled',
          mb: 1.5
        }}
      />
      <Typography sx={{
        color: 'text.secondary',
        fontSize: 14,
        mb: 0.5
      }}>
        Chưa có hoạt động nào
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: 'text.disabled',
          display: 'block'
        }}
      >
        Bình luận và hoạt động sẽ hiện ở đây
      </Typography>
    </Box>
  );
}

export default ActivityEmptyState;
