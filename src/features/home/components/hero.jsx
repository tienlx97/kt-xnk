'use client';

import { Section } from '@astryxdesign/core/Section';
import { Heading, Text } from '@astryxdesign/core/Text';

/**
 * @param {{ title: string, subtitle?: string }} props
 */
export function Hero({ title, subtitle }) {
  return (
    <Section variant="transparent" paddingBlock={10}>
      <Heading level={1} type="display-2" justify="center">
        {title}
      </Heading>
      {subtitle ? (
        <Text type="large" color="secondary" justify="center" display="block">
          {subtitle}
        </Text>
      ) : null}
    </Section>
  );
}
