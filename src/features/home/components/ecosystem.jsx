import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading, Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';

import { companies } from '../config/companies.js';
import { SectionHeading } from './section-heading.jsx';

const styles = stylex.create({
  logo: {
    height: '72px',
    maxWidth: '100%',
    objectFit: 'contain',
    width: 'auto',
  },
  // Offsets the `#he-sinh-thai` anchor past the sticky 64px header instead
  // of landing flush under it.
  anchor: {
    scrollMarginTop: '80px',
  },
});

export function Ecosystem() {
  return (
    <VStack id="he-sinh-thai" gap={5} xstyle={styles.anchor}>
      <SectionHeading
        title="Hệ sinh thái"
        description="6 công ty thành viên hoạt động trong các lĩnh vực đầu tư, xây dựng và công nghiệp."
      />
      <Grid columns={{ minWidth: 280, max: 3 }} gap={4}>
        {companies.map(({ name, field, logo }) => (
          <Card key={name} elevation="low">
            <VStack gap={3} hAlign="start">
              <Image
                src={logo.src}
                alt={`Logo ${name}`}
                width={logo.width}
                height={logo.height}
                {...stylex.props(styles.logo)}
              />
              <VStack gap={1}>
                <Heading level={3}>{name}</Heading>
                <Text type="supporting">{field}</Text>
              </VStack>
            </VStack>
          </Card>
        ))}
      </Grid>
    </VStack>
  );
}
