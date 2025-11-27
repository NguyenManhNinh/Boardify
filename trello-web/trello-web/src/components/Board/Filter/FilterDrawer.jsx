import {
  Drawer, Box, Typography, TextField, FormControl, FormLabel,
  RadioGroup, Radio, FormControlLabel, Chip, Avatar, Button, Divider,
  InputAdornment
} from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectBoardFilters, setFilterText, toggleFilterLabel,
  toggleFilterMember, setFilterDue, resetFilters
} from '~/redux/board/boardFilterSlice'
import { debounce } from 'lodash'
import { useCallback } from 'react'

function FilterDrawer({ open, onClose, boardLabels = [], boardMembers = [] }) {
  const dispatch = useDispatch()
  const filters = useSelector(selectBoardFilters)

  // Debounce search input
  const handleSearchChange = useCallback(debounce((value) => {
    dispatch(setFilterText(value))
  }, 300), [])

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 350 } }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TuneIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">Lọc thẻ</Typography>
        </Box>
        <Button size="small" onClick={onClose} sx={{ minWidth: 'auto', p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </Button>
      </Box>
      <Divider />

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Search */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Từ khóa</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm theo tên thẻ..."
            defaultValue={filters.text}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Labels */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Nhãn</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {boardLabels.length > 0 ? boardLabels.map(label => (
              <Chip
                key={label._id || label.id}
                label={label.title || 'No Title'}
                size="small"
                clickable
                onClick={() => dispatch(toggleFilterLabel(label._id || label.id))}
                sx={{
                  bgcolor: filters.labels.includes(label._id || label.id) ? label.color : 'transparent',
                  color: filters.labels.includes(label._id || label.id) ? 'white' : 'text.primary',
                  border: '1px solid',
                  borderColor: label.color || 'divider',
                  '&:hover': {
                    bgcolor: label.color,
                    color: 'white',
                    opacity: 0.8
                  }
                }}
              />
            )) : <Typography variant="caption" color="text.secondary">Không có nhãn nào</Typography>}
          </Box>
        </Box>

        {/* Members */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Thành viên</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {boardMembers.length > 0 ? boardMembers.map(member => (
              <Chip
                key={member._id}
                avatar={<Avatar src={member.avatar} alt={member.displayName} />}
                label={member.displayName}
                size="small"
                clickable
                onClick={() => dispatch(toggleFilterMember(member._id))}
                variant={filters.members.includes(member._id) ? 'filled' : 'outlined'}
                color={filters.members.includes(member._id) ? 'primary' : 'default'}
              />
            )) : <Typography variant="caption" color="text.secondary">Không có thành viên nào</Typography>}
          </Box>
        </Box>

        {/* Due Date */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Ngày hết hạn</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={filters.due}
              onChange={(e) => dispatch(setFilterDue(e.target.value))}
            >
              <FormControlLabel value="all" control={<Radio size="small" />} label="Tất cả" />
              <FormControlLabel value="overdue" control={<Radio size="small" />} label="Quá hạn" />
              <FormControlLabel value="today" control={<Radio size="small" />} label="Hôm nay" />
              <FormControlLabel value="week" control={<Radio size="small" />} label="Trong 7 ngày tới" />
              <FormControlLabel value="no-due" control={<Radio size="small" />} label="Không có hạn" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>

      <Divider sx={{ mt: 'auto' }} />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={() => dispatch(resetFilters())}
        >
          Xóa bộ lọc
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          Chỉ những thẻ khớp điều kiện mới được hiển thị
        </Typography>
      </Box>
    </Drawer>
  )
}

export default FilterDrawer
