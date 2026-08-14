import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  frame: {
    aspectRatio: '16 / 9',
    borderWidth: 0,
    display: 'block',
    width: '100%',
  },
});

/** @param {{ id: string, title: string }} props */
export function YouTubeEmbed({ id, title }) {
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${id}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      {...stylex.props(styles.frame)}
    />
  );
}
