
import { Box, Card } from '@mui/material'
import TrelloLeftSvg from '~/assets/trello-left.4f52d13c.svg?url'
import TrelloRightSvg from '~/assets/trello-right.e6e102c7.svg?url'

export const AuthLayout = ({ children }) => {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)',
      position: 'relative'
    }}>
      {/* Background Illustrations */}
      <img
        src={TrelloLeftSvg}
        alt="bg-left"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '30%',
          maxWidth: '400px',
          opacity: 0.9,
          filter: 'blur(0.5px)',
          pointerEvents: 'none'
        }}
      />
      <img
        src={TrelloRightSvg}
        alt="bg-right"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '30%',
          maxWidth: '400px',
          opacity: 0.9,
          filter: 'blur(0.5px)',
          pointerEvents: 'none'
        }}
      />

      <Card
        sx={{
          minWidth: 380,
          maxWidth: 580,
          width: '100%',
          bgcolor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          p: 4,
          m: 2,
          position: 'relative',
          zIndex: 1
        }}
      >
        {children}
      </Card>
    </Box>
  )
}
