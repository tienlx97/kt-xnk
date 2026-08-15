import { memo } from 'react';

/**
 * Filled play triangle for video thumbnails.
 *
 * Astryx's semantic icon registry has no `play` name (see
 * `astryx docs icons`), and `Icon` accepts any SVG component, so this is the
 * documented escape hatch rather than a workaround. It lives in the home
 * feature because that is its only consumer — promote it to
 * `src/shared/components/icon/` if a second feature ever needs it.
 *
 * `currentColor` + `1em` sizing let it inherit whatever `Icon`'s `size` and
 * `color` props resolve to, exactly like the built-in glyphs.
 *
 * @param {import('react').SVGProps<SVGSVGElement>} props
 */
export const IconPlay = memo(function IconPlay(props) {
  return (
    <svg
      aria-hidden="true"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* (8,5.5) → (8,18.5) → (19,12): the optical centre of a triangle
          sits left of its bounding box, so it is drawn a little right of
          the 12,12 geometric centre to look centred inside a circle. */}
      <path d="M8 5.5v13l11-6.5L8 5.5Z" />
    </svg>
  );
});
