'use client';

import { Section } from '@astryxdesign/core/Section';
import { Text } from '@astryxdesign/core/Text';

/**
 * @param {{ siteName: string, year: number }} props
 */
export function Footer({ siteName, year }) {
  return (
    <footer>
      <Section variant="transparent" dividers={['top']}>
        <Text type="supporting">
          © {year} {siteName}
        </Text>
      </Section>
    </footer>
  );
}
