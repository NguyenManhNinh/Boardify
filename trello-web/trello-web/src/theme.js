import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { cyan, deepOrange, teal, orange } from '@mui/material/colors';

const APP_BAR_HEIGHT = '58px';
const BOARD_BAR_HEIGHT = '60px';
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`;
const COLUMN_HEADER_HEIGHT = '50px';
const COLUMN_FOOTER_HEIGHT = '56px';

const theme = extendTheme({
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT,
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: teal[500] },
        secondary: { main: deepOrange[500] },
      },
    },
    dark: {
      palette: {
        primary: { main: cyan[500] },
        secondary: { main: orange[500] },
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdc3c7',
            borderRadius: '8px',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#00b894',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          // Note: The previous dark theme had a fontSize: '5rem' override which seemed like a mistake or test code.
          // I have removed it to ensure consistency. If it was intentional, it can be added back.
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '0.9rem',
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': { fontSize: '0.9rem' }
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '0.9rem',
        }),
        '& fieldset': {
          borderWidth: '0.5px !important',
        },
        '&:hover fieldset': {
          borderWidth: '1px !important',
        },
        '&.Mui-focused fieldset': {
          borderWidth: '1px !important',
        },
      },
    },
  },
});

export default theme;
