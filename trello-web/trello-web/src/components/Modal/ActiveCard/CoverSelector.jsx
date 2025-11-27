import { useState } from 'react';
import {
  Box,
  Button,
  Popover,
  Typography,
  Grid,
  IconButton,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

function CoverSelector({ card, onSetCover, onRemoveCover, onUploadAndSetCover, variant = 'default' }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0); // 0: Attachments, 1: URL, 2: Upload
  const [urlInput, setUrlInput] = useState('');

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setUrlInput('');
  };

  const handleSelectAttachment = (attachmentUrl) => {
    // Determine if it's an image or video
    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(attachmentUrl);
    const isYouTube = attachmentUrl.includes('youtube.com') || attachmentUrl.includes('youtu.be');

    let coverType = 'image';
    let thumbnailUrl = attachmentUrl;

    if (isYouTube) {
      coverType = 'video';
      const videoId = attachmentUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^?&]+)/)?.[1];
      thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : attachmentUrl;
    }

    onSetCover({
      type: coverType,
      url: attachmentUrl,
      thumbnailUrl: thumbnailUrl,
      attachmentId: null, // Will be handled by backend
      color: null
    });
    handleClose();
  };

  const handleSetFromUrl = () => {
    if (!urlInput) return;

    const isYouTube = urlInput.includes('youtube.com') || urlInput.includes('youtu.be');
    let coverType = 'image';
    let thumbnailUrl = urlInput;

    if (isYouTube) {
      coverType = 'video';
      const videoId = urlInput.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^?&]+)/)?.[1];
      thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : urlInput;
    }

    onSetCover({
      type: coverType,
      url: urlInput,
      thumbnailUrl: thumbnailUrl,
      attachmentId: null,
      color: null
    });
    setUrlInput('');
    handleClose();
  };

  return (
    <Box sx={{ display: 'inline-flex', gap: 1, alignItems: 'center' }}>
      {variant === 'floating' ? (
        <Button
          variant="contained"
          startIcon={<ImageIcon />}
          onClick={handleOpen}
          size="small"
          sx={{
            textTransform: 'none',
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
              boxShadow: 'none'
            }
          }}
        >
          Đổi ảnh bìa
        </Button>
      ) : variant === 'sidebar' ? (
        <Button
          fullWidth
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<ImageIcon />}
          onClick={handleOpen}
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            borderRadius: 1,
            borderColor: 'transparent',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : 'grey.100'),
            color: (theme) => (theme.palette.mode === 'dark' ? '#b6c2cf' : 'text.primary'),
            '&:hover': {
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'grey.200'),
              borderColor: 'transparent'
            }
          }}
        >
          Ảnh bìa thẻ
        </Button>
      ) : (
        <Button
          variant="outlined"
          startIcon={<ImageIcon />}
          onClick={handleOpen}
          size="small"
          sx={{ textTransform: 'none' }}
        >
          {card?.cover ? 'Thay đổi ảnh bìa' : 'Thêm ảnh bìa'}
        </Button>
      )}

      {/* Only show delete button if NOT in sidebar mode (sidebar usually just opens the menu)
          AND if cover exists.
          Actually, for floating mode, we want a separate delete button.
      */}
      {card?.cover && variant === 'floating' && (
        <IconButton
          size="small"
          onClick={onRemoveCover}
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
            }
          }}
          aria-label="Gỡ cover"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}

      {/* For default mode, keep old behavior */}
      {card?.cover && variant === 'default' && (
        <IconButton
          size="small"
          onClick={onRemoveCover}
          sx={{ ml: 0 }}
          aria-label="Gỡ cover"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ width: 320, p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Chọn cover
          </Typography>

          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{ mb: 2, minHeight: 36 }}
            variant="fullWidth"
          >
            <Tab label="Attachments" sx={{ minHeight: 36, textTransform: 'none' }} />
            <Tab label="URL" sx={{ minHeight: 36, textTransform: 'none' }} />
            <Tab label="Upload" sx={{ minHeight: 36, textTransform: 'none' }} />
          </Tabs>

          {/* Tab 0: From Attachments */}
          {tabValue === 0 && (
            <Box>
              {card?.attachments && card.attachments.length > 0 ? (
                <Grid container spacing={1}>
                  {card.attachments.map((attachmentUrl, index) => {
                    // Check if it's an image to display
                    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(attachmentUrl);

                    return (
                      <Grid item xs={6} key={index}>
                        <Box
                          onClick={() => handleSelectAttachment(attachmentUrl)}
                          sx={{
                            cursor: 'pointer',
                            border: '2px solid',
                            borderColor: card?.cover?.url === attachmentUrl ? 'primary.main' : 'transparent',
                            borderRadius: 1,
                            overflow: 'hidden',
                            bgcolor: 'grey.100',
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'grey.200'
                            }
                          }}
                        >
                          {isImage ? (
                            <img
                              src={attachmentUrl}
                              alt="attachment"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <AttachFileIcon color="action" />
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  Chưa có attachments
                </Typography>
              )}
            </Box>
          )}

          {/* Tab 1: From URL */}
          {tabValue === 1 && (
            <Box>
              <TextField
                fullWidth
                placeholder="Nhập URL ảnh hoặc YouTube..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                size="small"
                sx={{ mb: 1 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSetFromUrl();
                  }
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleSetFromUrl}
                disabled={!urlInput}
              >
                Đặt làm Cover
              </Button>
            </Box>
          )}

          {/* Tab 2: Upload new */}
          {tabValue === 2 && (
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<AttachFileIcon />}
              sx={{ textTransform: 'none' }}
            >
              Upload & Set as Cover
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    onUploadAndSetCover(e.target.files[0]);
                    handleClose();
                  }
                }}
              />
            </Button>
          )}
        </Box>
      </Popover>
    </Box>
  );
}

export default CoverSelector;
