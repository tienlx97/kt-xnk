import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading, Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';

import { companies } from '../config/companies.js';

export function Ecosystem() {
  return (
    <VStack gap={4} paddingBlock={4}>
      <VStack gap={1}>
        <Heading level={2} type="display-3">
          Hệ sinh thái
        </Heading>
        <Text type="body" color="secondary">
          6 công ty thành viên hoạt động trong các lĩnh vực đầu tư, xây dựng
          và công nghiệp.
        </Text>
      </VStack>
      <Grid columns={{ minWidth: 280, max: 3 }} gap={4}>
        {companies.map(({ name, field }) => (
          <Card key={name} elevation="low">
            <VStack gap={1}>
              <Heading level={3}>{name}</Heading>
              <Text type="supporting">{field}</Text>
            </VStack>
          </Card>
        ))}
      </Grid>
    </VStack>
  );
}
