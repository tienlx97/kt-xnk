import { AspectRatio } from '@astryxdesign/core/AspectRatio';

/**
 * Responsive video embed for MDX content — react.dev's `<YouTubeIframe>`.
 * youtube-nocookie.com avoids setting tracking cookies until playback
 * starts.
 * @param {{ id: string, title: string }} props
 */
export function YouTubeEmbed({ id, title }) {
  return (
    <AspectRatio ratio={16 / 9}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </AspectRatio>
  );
}
