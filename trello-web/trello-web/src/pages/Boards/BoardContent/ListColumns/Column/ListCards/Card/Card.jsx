import { Box, Button, Typography, Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import GroupIcon from '@mui/icons-material/Group';
import CommentIcon from '@mui/icons-material/Comment';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Chip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { showCardDetailModal } from '~/redux/activeCard/activeCardSlice';

function Card({ card, columnTitle }) {
  if (!card) return null;  // Add safeguard for undefined card

  const dispatch = useDispatch();
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!card?.dueDate) return;

    const now = Date.now();
    const dueDate = new Date(card.dueDate).getTime();
    const dueSoonTime = dueDate - 24 * 60 * 60 * 1000;

    let timeoutId;
    // Calculate next update time
    // If currently before "due soon", wait until "due soon"
    if (now < dueSoonTime) {
      timeoutId = setTimeout(() => setTick(t => t + 1), dueSoonTime - now);
    }
    // If currently "due soon" (but not overdue), wait until "overdue"
    else if (now < dueDate) {
      timeoutId = setTimeout(() => setTick(t => t + 1), dueDate - now);
    }

    return () => clearTimeout(timeoutId);
  }, [card?.dueDate]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: { ...card }
  });

  const dndKitCardStyles = {
    touchAction: 'none', // Dành cho thiết bị cảm ứng
    //Nếu sử dung Css.Transform như đóc sẽ kiểu lỗi stretch
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined,
  };

  const handleCardClick = () => {
    dispatch(showCardDetailModal({ ...card, columnTitle }));
  };

  const shouldShowCardActions = () => {
    return !!(card?.memberIds?.length ||
      card?.comments?.length ||
      card?.attachments?.length ||
      card?.dueDate)
  }

  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
      }}
    >
      {card?.cover && (
        <Box
          sx={{
            width: '100%',
            height: 180,
            borderRadius: '10px 10px 0 0',
            overflow: 'hidden',
            bgcolor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative' // Added for absolute positioning of play icon
          }}
        >
          <img
            src={card.cover.thumbnailUrl || card.cover.url || card.cover}
            alt="Card cover"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          {/* Play Icon Overlay for Videos */}
          {card.cover.type === 'video' && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                pointerEvents: 'none'
              }}
            >
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderLeft: '12px solid #fff',
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  ml: '4px'
                }}
              />
            </Box>
          )}
        </Box>
      )}
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        {card?.labels?.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            {card?.labels?.map((label, index) => (
              <Chip
                key={index}
                sx={{
                  bgcolor: label.color,
                  color: 'white',
                  height: '8px',
                  width: '32px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  '& .MuiChip-label': { padding: 0 }
                }}
              />
            ))}
          </Box>
        )}
        <Typography>{card?.title} </Typography>
      </CardContent>
      {shouldShowCardActions() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length && <Button size="small"
            startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>}
          {!!card?.comments?.length && <Button size="small"
            startIcon={<CommentIcon />}>{card?.comments?.length}</Button>}
          {!!card?.attachments?.length && <Button size="small"
            startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>}
          {!!card?.dueDate && (
            <Button
              size="small"
              startIcon={<AccessTimeIcon />}
              sx={{
                color: (theme) => {
                  const now = Date.now();
                  const dueDate = new Date(card.dueDate).getTime();
                  const isOverdue = dueDate < now;
                  const isDueSoon = !isOverdue && (dueDate - now) <= 24 * 60 * 60 * 1000;
                  if (isOverdue) return '#eb5a46';
                  if (isDueSoon) return '#f2d600';
                  return theme.palette.text.secondary;
                },
                '& .MuiButton-startIcon': { mr: 0.5 }
              }}
            >
              {new Date(card.dueDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}
            </Button>
          )}
        </CardActions>
      }
    </MuiCard>
  )
}

export default Card
