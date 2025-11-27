import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import SubjectIcon from '@mui/icons-material/Subject';
import { useState, useEffect } from 'react';
import DescriptionEmptyState from './DescriptionEmptyState';

function CardDescriptionSection({ description, onUpdateDescription }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localDescription, setLocalDescription] = useState(description || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalDescription(description || '');
  }, [description]);

  const handleSave = () => {
    setIsSaving(true);
    onUpdateDescription(localDescription);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setLocalDescription(description || '');
    setIsEditing(false);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SubjectIcon sx={{ mr: 1.5, color: 'text.primary' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>Mô tả</Typography>
      </Box>

      <Box sx={{ pl: 0 }}> {/* Removed padding-left to align with header */}
        {!localDescription && !isEditing ? (
          <DescriptionEmptyState onEdit={() => setIsEditing(true)} />
        ) : (
          <Box>
            {isEditing ? (
              <Box sx={{ maxWidth: '100%' }}>
                <TextField
                  multiline
                  minRows={4}
                  fullWidth
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      handleCancel();
                    }
                  }}
                  placeholder="Thêm mô tả chi tiết hơn..."
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                      lineHeight: 1.6,
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : 'background.paper'),
                      borderRadius: 1,
                      padding: 2,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0,0,0,0.2)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2
                      }
                    }
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!localDescription.trim()}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      boxShadow: 'none',
                      '&:hover': { boxShadow: 'none' }
                    }}
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="text"
                    onClick={handleCancel}
                    sx={{
                      textTransform: 'none',
                      color: 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    Hủy
                  </Button>
                  {isSaving && (
                    <Typography variant="caption" color="text.secondary">
                      Đang lưu...
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Box
                onClick={() => setIsEditing(true)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    '& .description-content': {
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : 'grey.50')
                    }
                  }
                }}
              >
                <Box
                  className="description-content"
                  sx={{
                    p: 0,
                    borderRadius: 1,
                    transition: 'background-color 0.1s',
                    position: 'relative'
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: 'text.primary',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {localDescription}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default CardDescriptionSection;
