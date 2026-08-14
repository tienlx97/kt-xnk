import { Section } from '@astryxdesign/core/Section';
import { VStack } from '@astryxdesign/core/VStack';

import { Ecosystem, Hero } from '../../features/home/index.js';
import { site } from '../../shared/config/site.js';

export default function HomePage() {
  return (
    <Section variant="transparent" paddingBlock={8}>
      <VStack gap={8}>
        <Hero
          title={site.name}
          slogan={site.slogan}
          subtitle={site.description}
        />
        <Ecosystem />
      </VStack>
    </Section>
  );
}
