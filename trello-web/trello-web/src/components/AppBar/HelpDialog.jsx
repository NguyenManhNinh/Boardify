import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CloseIcon from '@mui/icons-material/Close'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'
import FacebookIcon from '@mui/icons-material/Facebook'

function HelpDialog() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Tooltip title="Trợ giúp">
        <IconButton onClick={handleOpen}>
          <HelpOutlineIcon sx={{ color: 'white' }} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
          Hướng dẫn sử dụng bảng công việc
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* Quick Guide */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Bắt đầu nhanh với bảng này
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="• Tạo cột mới: click 'Thêm danh sách khác."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="• Tạo thẻ công việc: click 'Thêm thẻ' trong cột."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="• Sắp xếp: kéo thả thẻ hoặc cả cột đến vị trí bạn muốn."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="• Tìm nhanh thẻ: gõ tên thẻ vào ô tìm kiếm trên thanh trên cùng."
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Keyboard Shortcuts */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Phím tắt hữu ích
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Tìm kiếm thẻ trong bảng</Typography>
                <Chip label="Ctrl + K" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Mở hộp thoại trợ giúp</Typography>
                <Chip label="?" size="small" />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Contact & Portfolio */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Liên hệ với tôi
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link
                href="https://github.com/NguyenManhNinh"
                target="_blank"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
              >
                <GitHubIcon />
                <Typography>Xem mã nguồn dự án trên GitHub</Typography>
              </Link>

              <Link
                href="mailto:nguyennmanhninh2005@gmail.com?subject=Yêu cầu hỗ trợ - Boardify&body=Xin chào,%0D%0A%0D%0ATôi cần hỗ trợ về:%0D%0A"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
              >
                <EmailIcon />
                <Typography>Gửi email cho mình</Typography>
              </Link>

              <Link
                href="https://www.facebook.com/nguymanhninh/"
                target="_blank"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
              >
                <FacebookIcon />
                <Typography>Kết nối với mình trên Facebook</Typography>
              </Link>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* About */}
          <Box>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Boardify - Ứng dụng quản lý công việc<br />
              Version 1.0.0
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default HelpDialog
