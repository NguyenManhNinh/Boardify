import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box
} from '@mui/material';

function MoveColumnDialog({ open, onClose, column, columns, onConfirm }) {
  const [selectedPosition, setSelectedPosition] = useState('');

  useEffect(() => {
    if (open && column && columns) {
      // Find current index (1-based for user friendliness)
      const currentIndex = columns.findIndex(c => c._id === column._id);
      setSelectedPosition(currentIndex);
    }
  }, [open, column, columns]);

  const handleConfirm = () => {
    onConfirm(column._id, selectedPosition);
    onClose();
  };

  if (!column) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Di chuyển cột</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Di chuyển cột <strong>{column.title}</strong> đến vị trí:
          </Typography>

          <FormControl fullWidth size="small">
            <InputLabel id="position-select-label">Vị trí</InputLabel>
            <Select
              labelId="position-select-label"
              value={selectedPosition}
              label="Vị trí"
              onChange={(e) => setSelectedPosition(e.target.value)}
            >
              {columns?.map((col, index) => (
                <MenuItem key={col._id} value={index}>
                  {index + 1} {col._id === column._id ? '(Hiện tại)' : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Hủy</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Di chuyển
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MoveColumnDialog;
