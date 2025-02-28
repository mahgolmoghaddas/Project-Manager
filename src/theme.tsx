// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black for primary UI elements
    },
    secondary: {
      main: '#ADD8E6', // Light Blue for background and accents
    },
    error: {
      main: '#D8B4DD', // Light Purple for error states or alerts
    },
    background: {
      default: '#FFFFFF', // White background
      paper: '#FFFFFF', // White background for paper elements
    },
    text: {
      primary: '#000000', // Black text for readability
      secondary: '#ADD8E6', // Light Blue for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h4: {
      fontWeight: '600',
      fontSize: '36px',
      color: '#000000', // Black for headings
    },
    h6: {
      fontWeight: '500',
      fontSize: '20px',
      color: '#ADD8E6', // Light Blue for sub-headings
    },
    body1: {
      fontSize: '16px',
      color: '#000000', // Black for body text
    },
    body2: {
      fontSize: '14px',
      color: '#D8B4DD', // Light Purple for smaller secondary text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '10px 20px',
          backgroundColor: '#000080', // Navy Blue for primary buttons
          color: '#FFFFFF', // White text on navy blue button
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            backgroundColor: '#ADD8E6', // Light Blue for hover effect
            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF', // White background for dialog
          borderRadius: '12px',
          padding: '20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000', // Black for card background
          borderRadius: '12px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          padding: '20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // White background for input fields to stand out
          borderRadius: '8px',
          marginBottom: '15px',
          '& .MuiInputBase-root': {
            color: '#000000', // Black text inside input fields
          },
          '& .MuiInputLabel-root': {
            color: '#ADD8E6', // Light Blue for input labels
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000080', // Navy Blue border color
            },
            '&:hover fieldset': {
              borderColor: '#D8B4DD', // Light Purple on hover
            },
          },
        },
      },
    },
  },
});

export default theme;
