import { defineTheme } from '@astryxdesign/core/theme';

// Color system for the kt-xnk brand, built the way react.dev builds theirs
// (github.com/reactjs/react.dev -> colors.js), measured with Astryx's own
// hexToHct/contrastRatio. Three rules carried over from that palette:
//
//   1. The brand token IS the logo color. react.dev's `brand`/`link` is
//      literally the React logo cyan (#087EA4), not a darkened variant. Ours
//      are sampled straight off public/images/logo-dn-group.png: teal
//      #247768 (accent) and red #c2252a (secondary). Both clear WCAG AA on
//      white (5.37:1 / 5.85:1 — react.dev's own brand only manages 4.64:1),
//      so there is no reason to darken them.
//   2. One hue for every neutral, with chroma shaped by tone — near-zero at
//      light tones, peaking mid, easing off dark. react.dev runs hue ~275 at
//      chroma 1.1 (tone 97) -> 14.2 (tone 55) -> 5.8 (tone 16). Ours runs the
//      brand hue 178.4 on the same curve. This replaced a split-brain palette
//      where surfaces were pure gray (chroma 0) but text and borders were
//      still teal-tinted (chroma 4-8) — two unrelated systems in one theme.
//   3. The page background stays pure white. react.dev's `wash` is #FFFFFF
//      too; the tint only ever shows up in mid-tones, never behind the page.
//
// Status hues (green/amber/red) stay conventional rather than rebranded —
// react.dev keeps theirs too — but are retinted into react.dev's soft band
// (chroma ~6, tone ~95) so callouts stop shouting.
//
// Light theme only, per openspec/project.md, so every token below is a single
// value rather than Astryx's [light, dark] tuple form.
export const ktxnkTheme = defineTheme({
  name: 'kt-xnk',
  // react.dev sets its document body to 17px (text-lg) and sidebar links to
  // 15px (text-base). Raising Astryx's geometric scale from the neutral
  // default of 14px keeps the same hierarchy while matching that more
  // readable documentation density: body is 17px and supporting text is
  // 14px, with headings increasing proportionally.
  typography: {
    scale: { base: 17, ratio: 1.2 },
    body: {
      family: 'Optimistic Text',
      fallbacks:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    heading: {
      family: 'Optimistic Display',
      fallbacks:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    code: {
      family: 'Source Code Pro',
      fallbacks:
        '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
  tokens: {
    // Brand teal, exactly as it appears in the logo — drives primary buttons,
    // focus rings, links, and accent-colored icons.
    '--color-accent': '#247768',
    // react.dev's `highlight` recipe: brand hue at chroma 7 / tone 96, a
    // whisper of brand rather than a fill. Astryx resolves BOTH the selected
    // SideNavItem and `Banner status="info"` (i.e. every <Note> callout) to
    // this token, so an over-saturated value here turns both into mint blobs.
    '--color-accent-muted': '#e5f8f3',
    '--color-on-accent': '#ffffff',
    '--color-text-accent': '#247768',
    '--color-icon-accent': '#247768',

    // Neutral ramp — brand hue 178.4, chroma shaped by tone (rule 2 above).
    // Surfaces: tone 100 / 98 / 96 / 94 keeps the body -> surface -> card ->
    // popover hierarchy readable at a glance.
    '--color-background-body': '#ffffff', // tone 100, chroma 0
    '--color-background-surface': '#f7faf9', // tone 98, chroma 1
    '--color-background-card': '#f0f4f3', // tone 96, chroma 1.5
    '--color-background-popover': '#eaefee', // tone 94, chroma 2

    // Text & icons — same ramp, mid/dark end.
    '--color-text-primary': '#1e2a27', // tone 16, chroma 6
    '--color-text-secondary': '#354b46', // tone 30, chroma 10
    '--color-icon-primary': '#1e2a27',
    '--color-icon-secondary': '#354b46',

    // Borders — same ramp. The hairline was previously tone 80 (a visibly
    // heavy gray-teal rule); react.dev's equivalent sits at tone 93.
    '--color-border': '#e7eceb', // tone 93, chroma 2 — decorative hairline
    '--color-border-emphasized': '#6a8a83', // tone 55, chroma 13 — form-control outlines, 3.77:1 on body (WCAG 1.4.11 needs 3:1)

    // Status colors — conventional hues, react.dev's soft tint band.
    // The muted values are what Banner paints as its header background.
    '--color-error': '#b4271f', // 5.68:1 on its own tint
    '--color-on-error': '#ffffff',
    '--color-error-muted': '#fdedea', // tone 95, chroma 6
    '--color-success-muted': '#eaf3e9', // tone 95, chroma 6 — pairs with the default #0d8626 at 4.15:1
    // Astryx's default --color-warning (#e9af08) is tone 74.8: only 1.75:1
    // against its own tint, failing WCAG 1.4.11 for non-text. Dropped to tone
    // 48 — the same move react.dev makes (their yellow solid is #B65700,
    // tone 48) — which lifts it to 4.23:1.
    '--color-warning': '#956b00',
    '--color-on-warning': '#ffffff', // 4.79:1; dark text on the new tone would be 3.09, failing AA
    '--color-warning-muted': '#f7f0e5', // tone 95, chroma 6

    // Deliberately left at Astryx/theme-neutral defaults: --color-success
    // (the solid green already passes on the new tint), the categorical tag
    // colors (--color-*-blue/cyan/gray/green/orange/pink/purple/red/teal/
    // yellow), and structural tokens (--color-neutral, --color-overlay*,
    // --color-skeleton, --color-track, --color-shadow, --color-tint-hover) —
    // these aren't brand identity, changing them would just be surprising.
  },
  components: {
    // Astryx's Button `variant` prop is an emphasis level, not a brand hue —
    // `variant="primary"` already resolves to --color-accent above, but
    // `variant="secondary"` defaults to a neutral gray (--color-neutral), not
    // our brand red. Point it at the logo red instead, so the two brand
    // colors carry equal visual weight where they meet. Red only surfaces
    // here (far less often than primary), so this doesn't make red the
    // dominant surface color.
    button: {
      'variant:secondary': {
        backgroundColor: '#c2252a', // logo red, 5.85:1 against the white label
        color: '#ffffff',
        // Astryx's built-in variants derive :hover/:active automatically via
        // color-mix(base, --color-tint-hover); a flat component override
        // like this one doesn't inherit that, so it must be declared
        // explicitly or the button has no press/hover feedback at all.
        ':hover': {
          backgroundColor:
            'color-mix(in srgb, #c2252a, var(--color-tint-hover) 15%)',
        },
        ':active': {
          backgroundColor:
            'color-mix(in srgb, #c2252a, var(--color-tint-hover) 25%)',
        },
      },
    },
  },
});
