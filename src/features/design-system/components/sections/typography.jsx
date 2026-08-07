'use client';

import { HStack } from '@astryxdesign/core/HStack';
import { Heading, Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';

import { ShowcaseSection } from '../showcase-section.jsx';

/** @type {(1 | 2 | 3 | 4 | 5 | 6)[]} */
const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];
/** @type {('body' | 'large' | 'label' | 'supporting' | 'code')[]} */
const TEXT_TYPES = ['body', 'large', 'label', 'supporting', 'code'];
/** @type {('primary' | 'secondary' | 'accent' | 'disabled')[]} */
const TEXT_COLORS = ['primary', 'secondary', 'accent', 'disabled'];

export function TypographySection() {
  return (
    <>
      <ShowcaseSection
        title="Heading"
        description="6 cấp, element h1–h6 tương ứng — dùng level đúng theo outline tài liệu, không nhảy cấp."
      >
        <VStack gap={2}>
          {HEADING_LEVELS.map((level) => (
            <Heading key={level} level={level}>
              Heading level {level}
            </Heading>
          ))}
        </VStack>
      </ShowcaseSection>

      <ShowcaseSection
        title="Text"
        description="type quyết định cỡ/độ đậm; color quyết định màu — hai trục độc lập."
      >
        <VStack gap={3}>
          {TEXT_TYPES.map((type) => (
            <Text key={type} type={type} display="block">
              {`type="${type}" — Xuất nhập khẩu container quốc tế`}
            </Text>
          ))}
          <HStack gap={4} wrap="wrap">
            {TEXT_COLORS.map((color) => (
              <Text key={color} type="body" color={color}>
                {`color="${color}"`}
              </Text>
            ))}
          </HStack>
        </VStack>
      </ShowcaseSection>
    </>
  );
}
