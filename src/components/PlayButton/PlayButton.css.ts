import { style } from '@vanilla-extract/css';
import { vars } from '~/styles/theme.css.ts';

export const playButton = style({
  height: vars.playButton.height,
  background: `linear-gradient(125deg, hsl(45,93%,58%), hsl(40,93%,58%))`,
  color: vars.color.dark.primary,
  fontWeight: 'bold',
  width: 240,
  textAlign: 'center',
  borderRadius: 8,
  transition: 'transform 100ms',
  boxShadow: `0px 10px 50px 0px hsla(45,93%,58%, 0.25)`,
  position: 'relative',
  userSelect: 'none',
  outline: 'none',

  selectors: {
    '&:hover, &:focus-visible': {
      transform: 'scale(1.02)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
    '&[data-loading=true]': {
      opacity: 0.75,
      transform: 'none !important',
    },
  },
});

export const statusMessage = style({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: vars.playButton.height,
  top: 0,
  fontSize: '1.75rem',

  selectors: {
    '&[data-small=true]': {
      fontSize: '1.5rem',
    },
  },
});

export const stageMessage = style({
  position: 'absolute',
  fontSize: '0.6rem',
  color: vars.color.white,
  height: 16,
  bottom: -24,
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});
