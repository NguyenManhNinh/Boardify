import { Box, Button, List, Typography } from '@mui/material'
import { useState } from 'react';
import { toast } from 'react-toastify'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCardIcon from '@mui/icons-material/AddCard';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ListCards from './ListCards/ListCards';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { useConfirm } from "material-ui-confirm";
import EditIcon from '@mui/icons-material/Edit';
import MoveColumnDialog from './MoveColumnDialog';


function Column({ column, createNewCard, deleteColumnDetails, updateColumnDetails, moveColumnToPosition, columns }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column._id,
    data: { ...column }
  });

  const dndKitColumnStyles = {
    // Chúng ta đã dùng delay 250ms cho TouchSensor nên có thể để manipulation để vừa scroll vừa drag (hold to drag)
    touchAction: 'none',
    //Nếu sử dung Css.Transform như đóc sẽ kiểu lỗi stretch
    transform: CSS.Translate.toString(transform),
    transition,
    willChange: 'transform', // Optimize for mobile performance
    height: '100%',
    //Chiều cao phải luôn max 100% vì nếu không sẽ lỗi lúc kéo thả column ngắn quá một cái column dài thì phải kéo ở khu vực giữa giữa rất khó chịu (demo ở vidoe 32)Lưu ý
    // lúc này phải kết hợp với (...listeners) ở Box bên dưới
    opacity: isDragging ? 0.5 : undefined,
  };
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => { setAnchorEl(event.currentTarget) }
  const handleClose = () => { setAnchorEl(null) }
  //Card đã sắp xếp ở component cha cao nhất (Board/_id.jsx)
  const orderedCards = column.cards
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
  }
  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Please enter card title', { position: 'bottom-right' })
      return
    }
    //Tạo dữ liệu card để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    //gọi lên props func createNewCard nằm ở component cha cao nhất {Boards/_id.jsx}
    createNewCard(newCardData)
    //Dong cua form
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }
  //Xử lý xóa 1 column và cards bên trong nó
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Xóa column',
      description: 'Hành động này sẽ xóa vĩnh viễn Cột và Thẻ của bạn! Bạn có chắc không?',
      confirmationText: 'Đồng ý',
      cancellationText: 'Hủy bỏ',
    }).then(() => {
      deleteColumnDetails(column._id)
    }).catch(() => { })
  }

  // Archive Column Logic
  const confirmArchiveColumn = useConfirm()
  const handleArchiveColumn = () => {
    confirmArchiveColumn({
      title: 'Lưu trữ cột này?',
      description: 'Hành động này sẽ lưu trữ cột và tất cả các thẻ bên trong. Bạn có thể khôi phục lại sau.',
      confirmationText: 'Lưu trữ',
      cancellationText: 'Hủy',
    }).then(() => {
      updateColumnDetails(column._id, { _destroy: true })
    }).catch(() => { })
  }

  // Rename Column Logic
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(column?.title)

  const enableEditingTitle = () => {
    setIsEditingTitle(true)
    setTitleValue(column?.title)
    handleClose() // Close menu if open
  }

  const handleRenameColumn = () => {
    if (!titleValue.trim()) {
      setTitleValue(column?.title) // Reset if empty
      setIsEditingTitle(false)
      return
    }

    if (titleValue.trim() !== column?.title) {
      updateColumnDetails(column._id, { title: titleValue.trim() })
    }
    setIsEditingTitle(false)
  }

  // Move Column Logic
  const [openMoveDialog, setOpenMoveDialog] = useState(false)

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles}{...attributes}>
      <Box
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#f9fafb'),
          ml: 2,
          borderRadius: '12px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column'
        }}>
        <Box
          {...listeners}
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            touchAction: 'none',
            cursor: 'grab'
          }}>
          {isEditingTitle ? (
            <TextField
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleRenameColumn}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameColumn()
                if (e.key === 'Escape') {
                  setIsEditingTitle(false)
                  setTitleValue(column?.title)
                }
              }}
              autoFocus
              size="small"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '15px',
                  fontWeight: 600,
                  height: '32px',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white'),
                  '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                },
                '& input': {
                  px: 1,
                  py: 0.5
                }
              }}
            />
          ) : (
            <Tooltip title={column?.title}>
              <Typography
                variant='h6'
                onClick={enableEditingTitle}
                sx={{
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '220px'
                }}
              >
                {column?.title}
              </Typography>
            </Tooltip>
          )}

          <Box>
            <Tooltip title='More options'>
              <ExpandMoreIcon
                sx={{
                  color: 'text.primary',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button-workspaces',
                },
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .addCardIcon': {
                      color: 'success.light'
                    }
                  }
                }}
              >
                <ListItemIcon><AddCardIcon className='addCardIcon' fontSize="small" /></ListItemIcon>
                <ListItemText>Thêm thẻ</ListItemText>
              </MenuItem>

              <MenuItem onClick={enableEditingTitle}>
                <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Đổi tên cột</ListItemText>
              </MenuItem>

              <MenuItem onClick={() => { setOpenMoveDialog(true); handleClose(); }}>
                <ListItemIcon><DragHandleIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Di chuyển cột</ListItemText>
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={handleArchiveColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .cancelIcon': {
                      color: 'warning.dark'
                    }
                  }
                }}
              >
                <ListItemIcon><Cloud className='cancelIcon' fontSize="small" /></ListItemIcon>
                <ListItemText>Lưu trữ cột này</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box >
        <ListCards cards={orderedCards} columnTitle={column?.title} />
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 1.5,
          mt: 'auto'
        }}>
          {!openNewCardForm
            ? <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Button
                fullWidth
                startIcon={<AddCardIcon />}
                onClick={toggleOpenNewCardForm}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  color: 'text.secondary',
                  bgcolor: 'transparent',
                  fontSize: '14px',
                  fontWeight: 500,
                  py: 1,
                  px: 1.5,
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                Thêm thẻ
              </Button>
            </Box>
            : <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.text.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white'),
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.text.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.text.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main },
                  },
                  '&.MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Button
                  data-no-dnd="true"
                  onClick={addNewCard}
                  variant='contained' color='success' size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0,5px,solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >Add</Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer',
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box >

      <MoveColumnDialog
        open={openMoveDialog}
        onClose={() => setOpenMoveDialog(false)}
        column={column}
        columns={columns}
        onConfirm={moveColumnToPosition}
      />
    </div >

  )
}
export default Column
