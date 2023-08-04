import { style } from '@vanilla-extract/css';
import { vars } from '~/styles/theme.css.ts';

export const progressBar = style({
  position: 'fixed',
  bottom: 0,
  left: 0,
  height: 8,
  width: '100%',
  zIndex: 10,
});

export const colorBar = style({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  backgroundColor: vars.color.accent,
});
