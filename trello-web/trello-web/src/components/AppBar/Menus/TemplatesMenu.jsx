import { useState } from 'react'
import {
  Box, Button, Menu, MenuItem, ListItemIcon,
  ListItemText, Typography, Divider
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import { BOARD_TEMPLATES } from '~/utilities/boardTemplates'
import CreateBoardFromTemplateDialog from '~/components/Board/CreateBoardFromTemplateDialog'

function TemplatesMenu() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)

  const open = Boolean(anchorEl)

  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template)
    setOpenDialog(true)
    handleClose()
  }

  // Group templates by category
  const groupedTemplates = BOARD_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {})

  return (
    <>
      <Button
        id="templates-button"
        aria-controls={open ? 'templates-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        sx={{ color: 'white' }}
        aria-label="Mở danh sách mẫu bảng"
      >
        Mẫu bảng
      </Button>

      <Menu
        id="templates-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: 1 }}
        MenuListProps={{
          'aria-labelledby': 'templates-button',
        }}
        PaperProps={{
          sx: { width: 320, maxHeight: 480 }
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">Mẫu bảng</Typography>
          <Typography variant="caption" color="text.secondary">
            Chọn mẫu để tạo bảng mới nhanh hơn
          </Typography>
        </Box>
        <Divider />

        {/* Templates List */}
        <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
          {Object.entries(groupedTemplates).map(([category, templates]) => (
            <Box key={category}>
              <Typography
                variant="subtitle2"
                sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 600, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#f4f5f7') }}
              >
                {category}
              </Typography>
              {templates.map((template) => (
                <MenuItem
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  sx={{
                    py: 1.5,
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                    {/* Thumbnail */}
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: template.thumbnailColor,
                        mr: 1.5,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <DashboardCustomizeIcon sx={{ color: 'white', fontSize: 18, opacity: 0.8 }} />
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {template.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2, mt: 0.5 }}>
                        {template.description}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Box>
          ))}
        </Box>

        <Divider />

        {/* Footer */}
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            size="small"
            onClick={() => {
              handleClose()
              alert('Tính năng đang phát triển!')
            }}
          >
            Xem tất cả mẫu
          </Button>
        </Box>
      </Menu>

      <CreateBoardFromTemplateDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        template={selectedTemplate}
      />
    </>
  )
}

export default TemplatesMenu
