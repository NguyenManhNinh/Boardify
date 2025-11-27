import { useState, useRef } from 'react';
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  Alert
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AttachmentUploader = ({ onUpload, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed'
  ];

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      return 'Kích thước file không được vượt quá 10MB';
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Loại file không được hỗ trợ. Chỉ chấp nhận: ảnh, PDF, tài liệu, và file nén';
    }
    return null;
  };

  const handleFileSelect = async (file) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message || 'Tải lên thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          backgroundColor: dragActive ? 'action.hover' : 'transparent',
          transition: 'all 0.2s',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer'
        }}
        onClick={() => {
          if (!disabled && !uploading) {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={disabled || uploading}
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.zip"
        />

        {uploading ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Đang tải lên...
            </Typography>
            <LinearProgress />
          </Box>
        ) : (
          <Box>
            <CloudUploadIcon
              sx={{
                fontSize: 48,
                color: dragActive ? 'primary.main' : 'text.secondary',
                mb: 1
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Kéo thả file hoặc click để chọn file
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
              Tối đa 10MB - Hỗ trợ: ảnh, PDF, tài liệu, file nén
            </Typography>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default AttachmentUploader;
