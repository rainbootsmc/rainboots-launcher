import { createTheme } from '@vanilla-extract/css';

export const [theme, vars] = createTheme({
  titleBar: {
    height: '36px',
  },
  color: {
    dark: {
      primary: 'hsla(210, 7%, 12%, 1)',
      secondary: 'hsl(218, 10%, 15%)',
    },
    white: '#EDEEF2',
    accent: 'hsl(45,93%,58%)',
  },
  playButton: {
    height: '60px',
  },
  padding: {
    regular: '8px',
  },
});
