'use client';

import { Text } from '@astryxdesign/core/Text';
import { TextInput as AstryxTextInput } from '@astryxdesign/core/TextInput';
import {
  colorVars,
  spacingVars,
  typeScaleVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';

// One caption line's worth of room: the "supporting" text's own line box
// plus a small gap. Shared by the container's reserved padding and the
// caption's `top` offset below so the two stay in lockstep — see the note
// on `caption.top` for why both need this same value.
const CAPTION_RESERVED_HEIGHT = `calc(${typeScaleVars['--text-supporting-size']} * ${typeScaleVars['--text-supporting-leading']} + ${spacingVars['--spacing-0-5']})`;

const styles = stylex.create({
  container: {
    position: 'relative',
  },
  // Reserves room for exactly one caption line below the input, permanently
  // — this padding never toggles with `status`, so it can't itself cause a
  // shift. The caption inside is absolutely positioned into this space
  // (see `caption`), so appearing/disappearing changes nothing about the
  // container's height; the reserved room just keeps it from overlapping
  // whatever comes after this field when it does show.
  containerWithCaption: {
    paddingBlockEnd: CAPTION_RESERVED_HEIGHT,
  },
  caption: {
    insetInlineStart: 0,
    position: 'absolute',
    // `top: 100%` would be 100% of this container's own height — which
    // already includes the reserved `paddingBlockEnd` — landing the caption
    // at the very bottom of the reserved room (i.e. right where whatever
    // comes after starts) instead of right below the input. Subtracting the
    // same reserved height back out anchors it to the input's bottom edge.
    top: `calc(100% - ${CAPTION_RESERVED_HEIGHT})`,
    whiteSpace: 'nowrap',
  },
  captionError: {
    color: colorVars['--color-text-red'],
  },
  captionWarning: {
    color: colorVars['--color-text-yellow'],
  },
  captionSuccess: {
    color: colorVars['--color-text-green'],
  },
});

/**
 * Drop-in replacement for Astryx's `TextInput` that renders `status` as a
 * compact, single-line caption instead of the padded, icon-bearing
 * `FieldStatus` box `statusVariant` produces. That box is too tall for a
 * simple hint, and even its `attached`/`detached` variants mount only when
 * a message is present — toggling the field's height and pushing whatever
 * comes after it. This caption is always reserved (see `containerWithCaption`)
 * and absolutely positioned (see `caption`), so it never does either.
 * `statusVariant` is intentionally not accepted — this component owns how
 * status is presented.
 * @param {Omit<import('@astryxdesign/core/TextInput').TextInputProps, 'statusVariant'>} props
 */
export function TextInput({ status, ...rest }) {
  const captionColorStyle =
    status?.type === 'error'
      ? styles.captionError
      : status?.type === 'warning'
        ? styles.captionWarning
        : styles.captionSuccess;

  return (
    <VStack
      gap={0}
      hAlign="stretch"
      xstyle={[styles.container, status && styles.containerWithCaption]}
    >
      <AstryxTextInput {...rest} status={status} statusVariant="tooltip" />
      {status && (
        <Text
          type="supporting"
          maxLines={1}
          xstyle={[styles.caption, captionColorStyle]}
        >
          {status.message}
        </Text>
      )}
    </VStack>
  );
}

TextInput.displayName = 'TextInput';
