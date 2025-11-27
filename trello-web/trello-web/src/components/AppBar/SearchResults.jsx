import { Box, Paper, Typography, List, ListItemButton, ListItemText, Chip } from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import DescriptionIcon from '@mui/icons-material/Description'

function SearchResults({ results, onCardClick }) {
  if (results.length === 0) {
    return (
      <Paper
        elevation={8}
        sx={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: 350,
          maxHeight: 400,
          overflow: 'auto',
          zIndex: 9999,
          p: 3,
          bgcolor: 'white',
          border: '2px solid',
          borderColor: 'primary.main'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <SearchOffIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Không tìm thấy thẻ nào
          </Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        width: 350,
        maxHeight: 400,
        overflow: 'auto',
        zIndex: 9999,
        bgcolor: 'white',
        border: '2px solid',
        borderColor: 'primary.main'
      }}
    >
      <List sx={{ py: 0 }}>
        {results.map((result) => (
          <ListItemButton
            key={result.card._id}
            onClick={() => onCardClick(result)}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <DescriptionIcon sx={{ mr: 2, color: 'text.secondary' }} fontSize="small" />
            <ListItemText
              primary={result.card.title}
              secondary={
                <Chip
                  label={result.columnTitle}
                  size="small"
                  sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                />
              }
              secondaryTypographyProps={{ component: 'div' }}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  )
}

export default SearchResults
