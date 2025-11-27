import { Box, Button, Typography } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';

/**
 * Empty state for card description section
 * Shows a friendly message encouraging users to add description
 * Includes hover effects and smooth transitions
 */
function DescriptionEmptyState({ onEdit }) {
  return (
    <Button
      fullWidth
      onClick={onEdit}
      aria-label="Thêm mô tả chi tiết cho thẻ"
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 2,
        minHeight: 80,
        py: 2,
        px: 3,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : 'grey.50'),
        borderRadius: 2,
        textTransform: 'none',
        color: 'text.primary',
        '&:hover': {
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'grey.100'),
          '& .empty-icon': {
            color: 'primary.main',
            transform: 'scale(1.1)'
          }
        },
        transition: 'all 0.2s ease'
      }}
    >
      {/* Icon */}
      <EditNoteIcon
        className="empty-icon"
        sx={{
          fontSize: 28,
          color: 'text.secondary',
          transition: 'all 0.2s'
        }}
      />

      {/* Text Content */}
      <Box sx={{ textAlign: 'left' }}>
        <Typography sx={{
          fontWeight: 500,
          fontSize: '0.95rem',
          mb: 0.5
        }}>
          Thêm mô tả chi tiết hơn...
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Thêm thông tin, checklist hoặc file đính kèm để làm rõ thẻ này
        </Typography>
      </Box>
    </Button>
  );
}

export default DescriptionEmptyState;
