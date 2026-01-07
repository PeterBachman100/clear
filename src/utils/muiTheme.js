import { createTheme } from "@mui/material";

export const mainTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
    },
    error: {
      main: '#FD1C03',
    },
    warning: {
      main: '#edbe02',
    },
    info: {
      main: '#1E90FF',
    },
    success: {
      main: '#00FF85',
    },
  },
  typography: {
    fontFamily: '"Roboto", "sans-serif"',
    fontSize: 12,
    fontWeightLight: 300,
    color: '#dcdee0',
    h1: {
      fontSize: '2.5rem',
    },
    h2: {
      fontSize: '2.1rem',
    },
    h3: {
      fontSize: '1.7rem',
    },
    h4: {
      fontSize: '1.5rem',
    },
    h5: {
      fontSize: '1.2rem',
    },
    h6: {
      fontSize: '1.1rem',
    },
    body1: {
      fontSize: '1rem',
    },
  },
  spacing: 4,
  components: {
    MuiDrawer: {
      defaultProps: {
        BackdropProps: {
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#000',
          }
        }
      }
    }
  },
});