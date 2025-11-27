import { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Chip
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

const AttachmentList = ({ attachments = [], onDelete }) => {
  const getFileIcon = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <ImageIcon />;
    } else if (ext === 'pdf') {
      return <PictureAsPdfIcon />;
    } else {
      return <DescriptionIcon />;
    }
  };

  const getFileName = (url) => {
    try {
      const urlParts = url.split('/');
      return decodeURIComponent(urlParts[urlParts.length - 1]);
    } catch {
      return 'Attachment';
    }
  };

  const isImage = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  };

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = getFileName(url);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab
      window.open(url, '_blank');
    }
  };

  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AttachFileIcon fontSize="small" />
        Đính kèm ({attachments.length})
      </Typography>
      <List sx={{ p: 0 }}>
        {attachments.map((url, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{ mb: 1 }}
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => handleDownload(url)}
                  title="Tải xuống"
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => onDelete(url)}
                  title="Xóa"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            }
          >
            <ListItemButton
              sx={{
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => handleDownload(url)}
            >
              {isImage(url) && (
                <Box
                  component="img"
                  src={url}
                  alt={getFileName(url)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                    mr: 2
                  }}
                />
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                {!isImage(url) && (
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    {getFileIcon(url)}
                  </Box>
                )}
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '200px'
                      }}
                    >
                      {getFileName(url)}
                    </Typography>
                  }
                />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AttachmentList;
