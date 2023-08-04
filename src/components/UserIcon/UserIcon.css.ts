import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '~/styles/theme.css.ts';

export const wrapper = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: vars.padding.regular,
  borderRadius: 8,
  backgroundColor: vars.color.dark.secondary,
  padding: vars.padding.regular,
});

export const logoutOverlay = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  pointerEvents: 'none',
  backdropFilter: 'brightness(0.5) blur(8px)',
  transition: 'opacity 50ms',
  borderRadius: 8,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: vars.padding.regular,
  fontSize: '0.8rem',
});

globalStyle(`${wrapper}:hover ${logoutOverlay}, ${wrapper}:focus-visible ${logoutOverlay}`, {
  opacity: 1,
});

export const logoutIcon = style({
  height: 18,
  width: 'auto',
});

export const icon = style({
  width: 24,
  height: 24,
  borderRadius: 4,
  overflow: 'hidden',
  userSelect: 'none',
});

export const guest = style({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

export const avatar = style({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
});

export const name = style({});
