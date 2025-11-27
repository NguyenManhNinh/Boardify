import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Typography, Box, IconButton, Divider, Grid } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardIcon from '@mui/icons-material/Keyboard'

export const ShortcutsModal = ({ open, onClose }) => {
  const shortcutGroups = [
    {
      title: 'Điều hướng chung',
      items: [
        { key: 'B', description: 'Mở menu Bảng' },
        { key: '/', description: 'Tìm kiếm' },
        { key: '?', description: 'Mở bảng Phím tắt' },
        { key: 'Esc', description: 'Đóng menu / modal' }
      ]
    },
    {
      title: 'Di chuyển trên bảng',
      items: [
        { key: '← ↑ → ↓', description: 'Di chuyển giữa các thẻ' },
        { key: 'Enter', description: 'Mở thẻ đang chọn' },
        { key: 'Shift + ↑/↓', description: 'Di chuyển thẻ lên/xuống' },
        { key: 'Shift + ←/→', description: 'Chuyển thẻ sang cột trái/phải' }
      ]
    },
    {
      title: 'Làm việc với thẻ (khi đang chọn)',
      items: [
        { key: 'N', description: 'Tạo thẻ mới ở dưới' },
        { key: 'Space', description: 'Gán thẻ cho bản thân' },
        { key: 'Q', description: 'Lọc thẻ của tôi' },
        { key: 'L', description: 'Thêm / chỉnh nhãn' },
        { key: 'D', description: 'Đặt / sửa ngày hết hạn' },
        { key: 'Del', description: 'Lưu trữ thẻ' }
      ]
    },
    {
      title: 'Board & giao diện',
      items: [
        { key: 'R', description: 'Làm mới dữ liệu bảng' },
        { key: 'T', description: 'Đổi chế độ Sáng/Tối' }
      ]
    }
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundImage: 'none',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <KeyboardIcon color="primary" />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Phím tắt
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {shortcutGroups.map((group, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                  {group.title}
                </Typography>
                <List disablePadding>
                  {group.items.map((shortcut, idx) => (
                    <ListItem
                      key={idx}
                      disablePadding
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1.5
                      }}
                    >
                      <ListItemText
                        primary={shortcut.description}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                      <Box
                        sx={{
                          bgcolor: 'action.selected',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          minWidth: '24px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          whiteSpace: 'nowrap',
                          ml: 2
                        }}
                      >
                        {shortcut.key}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider />

        <Box sx={{ p: 3, bgcolor: 'action.hover' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Cách sử dụng phím tắt
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            • Ở màn hình bảng công việc, dùng <b>phím mũi tên</b> để di chuyển qua lại giữa các thẻ.<br />
            • Khi một thẻ được viền sáng (đang được chọn), nhấn <b>Enter</b> để mở, <b>Space</b> để gán cho bạn, hoặc <b>N</b> để tạo thẻ mới.<br />
            • Nhấn <b>Shift + mũi tên</b> để di chuyển vị trí thẻ.<br />
            • Ở bất kỳ đâu, nhấn <b>/</b> để tìm kiếm, <b>Q</b> để lọc thẻ của bạn, <b>Esc</b> để đóng menu.<br />
            • Nhấn <b>?</b> để mở lại bảng này.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
