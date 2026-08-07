import { defineTheme } from '@astryxdesign/core/theme';

// Material Design 3 light-scheme role values for the kt-xnk brand. Tonal
// palettes were generated in CIE Lab space (tone = L*) from the brand seeds
// sampled off public/images/logo-dn-group.png: teal #247768 and red
// #c2252a. Teal is the MD3 *primary* seed and red is *secondary* — red as
// the dominant accent read as too harsh/glaring across filled surfaces
// (inputs, primary buttons); teal carries the brand instead, and red is
// kept for lower-emphasis/secondary use. See harness/PROGRESS.md
// (2026-08-07) for the full derivation and contrast verification. Light
// theme only, per openspec/project.md, so every token below is a single
// value rather than Astryx's [light, dark] tuple form.
export const ktxnkTheme = defineTheme({
  name: 'kt-xnk',
  tokens: {
    // Accent (brand teal) — drives primary buttons, focus rings, links,
    // and accent-colored icons.
    '--color-accent': '#126a5c', // MD3 primary
    '--color-accent-muted': '#a1f2df', // MD3 primaryContainer
    '--color-on-accent': '#fdffff', // MD3 onPrimary
    '--color-text-accent': '#126a5c', // MD3 primary — was defaulting to theme-neutral's dark gray, not the brand teal, for accent-colored text/links
    '--color-icon-accent': '#126a5c', // MD3 primary — same gap as text-accent

    // Surfaces — neutral (chroma 0) instead of teal-tinted: a mint-tinted
    // page background read as dated/"not modern" against solid brand-color
    // buttons; MD3 surfaces are meant to carry a hue tint, but plain white
    // + neutral gray steps is the more contemporary choice here. Tone
    // spacing (100/97.9/95.9/93.8) kept from the old tinted values so the
    // body → surface → card → popover hierarchy still reads at a glance.
    '--color-background-body': '#ffffff', // MD3 background, tone 100
    '--color-background-surface': '#f9f9f9', // MD3 surfaceContainerLow, tone 97.9
    '--color-background-card': '#f3f3f3', // MD3 surfaceContainer, tone 95.9
    '--color-background-popover': '#ededed', // MD3 surfaceContainerHigh, tone 93.8 — popovers/menus sit above cards

    // Text & icons
    '--color-text-primary': '#151d1b', // MD3 onSurface
    '--color-text-secondary': '#394a46', // MD3 onSurfaceVariant
    '--color-icon-primary': '#151d1b', // MD3 onSurface
    '--color-icon-secondary': '#394a46', // MD3 onSurfaceVariant

    // Borders
    '--color-border': '#b6cbc6', // MD3 outlineVariant
    '--color-border-emphasized': '#687b76', // MD3 outline

    // Error / destructive — kept distinct from --color-accent, same as the
    // MD3 palette's standalone error seed (see harness/PROGRESS.md)
    '--color-error': '#b4271f', // MD3 error
    '--color-on-error': '#fffefc', // MD3 onError
    '--color-error-muted': '#ffdbd3', // MD3 errorContainer

    // Deliberately left at Astryx/theme-neutral defaults: --color-success /
    // --color-warning (and their muted/on- pairs) — universal status-color
    // conventions (green/amber) read faster than a brand-consistent
    // reinterpretation would. Same for the categorical tag colors
    // (--color-*-blue/cyan/gray/green/orange/pink/purple/red/teal/yellow)
    // and structural tokens (--color-neutral, --color-overlay*, --color-skeleton,
    // --color-track, --color-shadow, --color-tint-hover) — these aren't
    // brand identity, changing them would just be surprising.
  },
  // Astryx's Button `variant` prop is an emphasis level, not a brand hue —
  // `variant="primary"` already resolves to --color-accent above, but
  // `variant="secondary"` defaults to a neutral gray (--color-neutral), not
  // our brand red. Override it to MD3's *solid* secondary/onSecondary pair
  // (tone 40/100 — same tone as --color-accent's primary tone) rather than
  // the pale secondaryContainer/onSecondaryContainer tones (90/10) used
  // before: secondaryContainer read as washed-out next to the solid teal
  // primary button, undermining the two brand colors' intended equal
  // visual weight. Red still only surfaces here (lower-frequency than
  // primary), so this doesn't reintroduce the "red as dominant surface"
  // problem that moved it off --color-accent in the first place — it's
  // just bolder where it does appear.
  components: {
    // SideNavItem's selected state defaults to --color-neutral (a generic
    // blue-gray tint, not our brand) — the active section in the sidebar
    // carried no brand color at all. react.dev's docs nav highlights the
    // active item in its brand blue; same idea here with our teal.
    'side-nav-item': {
      selected: {
        backgroundColor: 'var(--color-accent-muted)',
        color: 'var(--color-text-accent)',
        fontWeight: '600',
      },
    },
    button: {
      'variant:secondary': {
        backgroundColor: '#b91a24', // MD3 secondary (tone 40)
        color: '#ffffff', // MD3 onSecondary
        // Astryx's built-in variants derive :hover/:active automatically via
        // color-mix(base, --color-tint-hover); a flat component override
        // like this one doesn't inherit that, so it must be declared
        // explicitly or the button has no press/hover feedback at all.
        ':hover': {
          backgroundColor:
            'color-mix(in srgb, #b91a24, var(--color-tint-hover) 15%)',
        },
        ':active': {
          backgroundColor:
            'color-mix(in srgb, #b91a24, var(--color-tint-hover) 25%)',
        },
      },
    },
  },
});
