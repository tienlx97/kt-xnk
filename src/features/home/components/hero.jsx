import { Heading, Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';

/**
 * @param {{ title: string, slogan?: string, subtitle?: string }} props
 */
export function Hero({ title, slogan, subtitle }) {
  return (
    <VStack gap={3} paddingBlock={10}>
      <Heading level={1} type="display-2" justify="center">
        {title}
      </Heading>
      {slogan ? (
        <Text
          type="label"
          color="accent"
          justify="center"
          display="block"
          weight="bold"
        >
          {slogan}
        </Text>
      ) : null}
      {subtitle ? (
        <Text type="large" color="secondary" justify="center" display="block">
          {subtitle}
        </Text>
      ) : null}
    </VStack>
  );
}
