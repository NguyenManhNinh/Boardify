import { useState } from 'react';
import { toast } from 'react-toastify'
import { Box, Button, Typography } from '@mui/material'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';

function ListColumns({ columns, createNewColumn, createNewCard, deleteColumnDetails, updateColumnDetails, moveColumnToPosition }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = () => {
    if (!newColumnTitle.trim()) {
      toast.error('Please enter column title')
      return
    }
    //Tạo dữ liệu column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }
    createNewColumn(newColumnData)
    //GOi Api

    //Dong cua form
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  return (
    <SortableContext items={columns?.map(c => c._id) || []} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: "100%",
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column => <Column
          key={column._id}
          column={column}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
          updateColumnDetails={updateColumnDetails}
          moveColumnToPosition={moveColumnToPosition}
          columns={columns}
        />)}
        {/* Box add new column */}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
            minWidth: { xs: '100%', sm: '250px' },
            maxWidth: { xs: '100%', sm: '250px' },
            mx: { xs: 0, sm: 2 },
            mb: { xs: 2, sm: 0 },
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1,

              }}
            >
              Thêm danh sách khác
            </Button>
          </Box>
          : <Box sx={{
            minWidth: { xs: '100%', sm: '250px' },
            maxWidth: { xs: '100%', sm: '250px' },
            mx: { xs: 0, sm: 2 },
            mb: { xs: 2, sm: 0 },
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label="Enter column title..."
              type="text"
              size='small'
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  boxShadow: 'none',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white', },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white', },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white', },
                  '& .Mui-focused fieldset': { color: 'white' }
                }
              }}
            />
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Button
                onClick={addNewColumn}
                variant='contained' color='success' size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0,5px,solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add Column</Button>
              <CloseIcon
                fontSize='small'
                sx={{ color: 'white', cursor: 'pointer', '&:hover': { color: (theme) => theme.palette.error.light } }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }
      </Box >
    </SortableContext >

  )
}
export default ListColumns
