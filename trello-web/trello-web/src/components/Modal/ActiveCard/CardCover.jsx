import { Box, Button, IconButton } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';

function CardCover({ cover, onChangeCover, onRemoveCover }) {
  if (!cover) return null;

  return (
    <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
      {/* Cover Image */}
      <Box
        component="img"
        src={cover.thumbnailUrl || cover.url || cover}
        alt="Card cover"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '12px 12px 0 0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.02)',
            filter: 'brightness(1.08)'
          }
        }}
      />

      {/* Dark Gradient Overlay (bottom 30%) */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))',
        pointerEvents: 'none'
      }} />

      {/* Floating Actions (Glass Effect) */}
      <Box sx={{
        position: 'absolute',
        bottom: 16,
        left: 24,
        display: 'flex',
        gap: 1,
        zIndex: 2
      }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<ImageIcon />}
          onClick={onChangeCover}
          sx={{
            bgcolor: 'rgba(255,255,255,0.95)',
            color: 'text.primary',
            backdropFilter: 'blur(8px)',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,1)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Đổi ảnh bìa
        </Button>

        <IconButton
          size="small"
          onClick={onRemoveCover}
          sx={{
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: 'error.light',
              color: 'white',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default CardCover;
