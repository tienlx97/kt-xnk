/**
 * Plus glyph (Feather icon set, MIT licensed) — used for "add/create new"
 * actions. Not one of Astryx's built-in semantic icon names
 * (`astryx docs icons` has no `plus`/`add`), hence a local SVG like
 * `icon-shuffle.jsx`/`icon-refresh.jsx`.
 * @param {import('react').SVGProps<SVGSVGElement>} props
 */
export function IconPlus(props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
