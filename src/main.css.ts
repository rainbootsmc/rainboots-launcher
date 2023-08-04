import { style } from '@vanilla-extract/css';
import { vars } from '~/styles/theme.css.ts';

export const wrapper = style({
  position: 'absolute',
  height: '100%',
  width: '100%',
  backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, ${vars.color.dark.primary} 1px)`,
  backgroundSize: `20px 20px`,
  color: vars.color.white,

  '::before': {
    content: '',
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: `linear-gradient(hsla(210,7%,12%, 0), hsla(210,7%,12%, 0.75))`,
  },
});
