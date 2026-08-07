import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { VStack } from '@astryxdesign/core/VStack';

/**
 * Intro summary box for MDX content — react.dev's `<YouWillLearn>`.
 * Children are typically a markdown list (already styled by the `ul`/`li`
 * mapping in src/mdx-components.jsx).
 * @param {{ title?: string, children: import('react').ReactNode }} props
 */
export function YouWillLearn({ title = 'Bạn sẽ học được', children }) {
  return (
    <Card padding={4}>
      <VStack gap={2}>
        <Heading level={2}>{title}</Heading>
        {children}
      </VStack>
    </Card>
  );
}
