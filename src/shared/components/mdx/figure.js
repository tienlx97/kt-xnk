import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';

import { imageStyles } from './image-styles.js';

/**
 * Captioned image for MDX content — react.dev's `<Illustration>`. Plain
 * `<img>` rather than next/image: post authors give a `src`/`alt` without
 * intrinsic dimensions, which next/image requires.
 * @param {{ src: string, alt: string, caption?: string }} props
 */
export function Figure({ src, alt, caption }) {
  return (
    <VStack gap={2} as="figure">
      {/* eslint-disable-next-line @next/next/no-img-element -- see caption above */}
      <img src={src} alt={alt} {...stylex.props(imageStyles.img)} />
      {caption ? (
        <Text as="p" type="supporting" justify="center">
          {caption}
        </Text>
      ) : null}
    </VStack>
  );
}
