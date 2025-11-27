import { Box, Typography, Avatar } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CommentSection from '../CommentSection';

function CardActivitySection({ card, onUpdate }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FormatListBulletedIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>Hoạt động</Typography>
      </Box>

      {/* Comment Section */}
      <CommentSection
        card={card}
        onUpdate={onUpdate}
      />
    </Box>
  );
}

export default CardActivitySection;
