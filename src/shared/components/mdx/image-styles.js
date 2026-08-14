import * as stylex from '@stylexjs/stylex';

import { radiusVars } from './tokens.stylex.js';

// Shared between the raw `img` mapping (plain markdown `![]()`) and the
// opt-in `Figure` component, so a plain markdown image and a captioned one
// get identical treatment.
export const imageStyles = stylex.create({
  img: {
    borderRadius: radiusVars['--radius-container'],
    display: 'block',
    height: 'auto',
    maxWidth: '100%',
  },
});
