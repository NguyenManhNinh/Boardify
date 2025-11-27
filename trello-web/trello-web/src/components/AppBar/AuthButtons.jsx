import { Button, Box } from '@mui/material'

export const AuthButtons = ({ onLoginClick, onSignUpClick }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Button
        variant="outlined"
        size="small"
        onClick={onLoginClick}
        sx={{
          color: 'white',
          borderColor: 'white',
          textTransform: 'none',
          fontSize: '0.9rem',
          px: 2,
          '&:hover': {
            borderColor: 'white',
            bgcolor: 'rgba(255,255,255,0.1)'
          }
        }}
      >
        Log In
      </Button>

      <Button
        variant="contained"
        size="small"
        onClick={onSignUpClick}
        sx={{
          bgcolor: 'white',
          color: '#1565c0',
          textTransform: 'none',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          px: 2,
          '&:hover': {
            bgcolor: '#f5f5f5'
          }
        }}
      >
        Sign Up
      </Button>
    </Box>
  )
}
