import { style } from '@vanilla-extract/css';
import { vars } from '~/styles/theme.css.ts';

export const titleBarWrapper = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  height: vars.titleBar.height,
  backgroundColor: vars.color.dark.primary,
});

export const titleBar = style({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  gap: `calc(${vars.titleBar.height} / 3 / 2)`,
  userSelect: 'none',
  paddingLeft: `calc(${vars.titleBar.height} / 3)`,
  color: 'rgba(255, 255, 255, 0.5)',
  ['-webkit-app-region' as never]: 'drag',
});

export const appName = style({
  height: vars.titleBar.height,
  fontSize: '0.8rem',
  display: 'flex',
  alignItems: 'center',
});

export const appVersion = style({
  fontSize: '0.6rem',
});

export const buttons = style({
  display: 'flex',
  height: vars.titleBar.height,
  zIndex: 1,
});

export const button = style({
  color: 'rgba(255, 255, 255, 0.5)',
  height: '100%',
  width: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export const buttonIcon = style({
  height: 12,
  width: 12,
});

export const divider = style({
  width: 1,
  marginLeft: 4,
  marginRight: 4,
  height: '60%',
  top: '20%',
  position: 'relative',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
});
