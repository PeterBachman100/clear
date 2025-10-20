import { createTheme } from "@mui/material";

export const mainTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f2f2f2',
    },
    secondary: {
      main: '#000',
    },
    error: {
      main: '#f90000',
    },
    warning: {
      main: '#edbe02',
    },
    info: {
      main: '#58a8f3',
    },
    success: {
      main: '#2abf06',
    },
  },
  typography: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeightLight: 300,
    color: '#FFF',
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
            backgroundColor: '#ddd',
          }
        }
      }
    }
  },
});