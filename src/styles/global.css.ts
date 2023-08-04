import { fontFace, globalStyle } from '@vanilla-extract/css';

const hackGen35ConsoleNF = fontFace([
  {
    src: 'url(/fonts/HackGen35ConsoleNF-Regular.ttf)',
    fontWeight: 'normal',
  },
  {
    src: 'url(/fonts/HackGen35ConsoleNF-Bold.ttf)',
    fontWeight: 'bold',
  },
]);

globalStyle('html, body', {
  fontFamily: hackGen35ConsoleNF,
  colorScheme: 'dark',
});
