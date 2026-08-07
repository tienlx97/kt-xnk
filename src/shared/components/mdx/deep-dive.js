import { Card } from '@astryxdesign/core/Card';
import { Collapsible } from '@astryxdesign/core/Collapsible';

/**
 * Expandable "read more" section for MDX content — react.dev's
 * `<DeepDive>`, built on Astryx's Collapsible (collapsed by default,
 * unlike Collapsible's own default) inside a Card for visual separation.
 * @param {{ title: string, children: import('react').ReactNode }} props
 */
export function DeepDive({ title, children }) {
  return (
    <Card padding={4}>
      <Collapsible trigger={title} defaultIsOpen={false}>
        {children}
      </Collapsible>
    </Card>
  );
}
