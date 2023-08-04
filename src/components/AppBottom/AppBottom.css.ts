import { style } from '@vanilla-extract/css';
import { vars } from '~/styles/theme.css.ts';

export const appBottom = style({
  position: 'fixed',
  bottom: 0,
  left: 0,
  height: 80,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: vars.color.dark.primary,
  boxShadow: `0px 0px 8px rgba(0, 0, 0, 0.15)`,
});

export const playButtonWrapper = style({
  position: 'relative',
  top: `calc(${vars.playButton.height} / -2)`,
});

export const settingsButton = style({
  position: 'absolute',
  left: 0,
  bottom: 0,
  color: 'rgba(255, 255, 255, 0.5)',
  width: 36,
  height: 36,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 500ms',

  ':hover': {
    transform: 'rotateZ(60deg)',
  },
});

export const settingsButtonIcon = style({
  width: 18,
  height: 18,
});

