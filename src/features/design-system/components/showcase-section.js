'use client';

import { Section } from '@astryxdesign/core/Section';
import { Heading, Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';

/**
 * @param {{ title: string, description?: string, children: import('react').ReactNode }} props
 */
export function ShowcaseSection({ title, description, children }) {
  return (
    <Section variant="transparent" dividers={['bottom']} paddingBlock={6}>
      <VStack gap={4}>
        <VStack gap={1}>
          <Heading level={2}>{title}</Heading>
          {description ? (
            <Text type="body" color="secondary">
              {description}
            </Text>
          ) : null}
        </VStack>
        {children}
      </VStack>
    </Section>
  );
}
