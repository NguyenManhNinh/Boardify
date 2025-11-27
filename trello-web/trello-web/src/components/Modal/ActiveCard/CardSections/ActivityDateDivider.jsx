import { Box, Typography } from '@mui/material';
import {
  isToday,
  isYesterday,
  format,
  differenceInDays
} from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Date divider for activity timeline
 * Displays "Hôm nay", "Hôm qua", "X ngày trước", or formatted date
 */
function ActivityDateDivider({ date }) {
  const getDateLabel = (date) => {
    const dateObj = new Date(date);

    if (isToday(dateObj)) {
      return 'Hôm nay';
    }

    if (isYesterday(dateObj)) {
      return 'Hôm qua';
    }

    const daysAgo = differenceInDays(new Date(), dateObj);
    if (daysAgo < 7) {
      return `${daysAgo} ngày trước`;
    }

    return format(dateObj, 'dd MMMM yyyy', { locale: vi });
  };

  return (
    <Box sx={{ px: 3, py: 1.5, mt: 1 }}>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          fontSize: 11
        }}
      >
        {getDateLabel(date)}
      </Typography>
    </Box>
  );
}

export default ActivityDateDivider;
