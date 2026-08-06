import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { HStack, VStack } from '@astryxdesign/core/Layout';
import { Link } from '@astryxdesign/core/Link';
import { Section } from '@astryxdesign/core/Section';
import { Heading, Text } from '@astryxdesign/core/Text';

/** @type {(1 | 2 | 3 | 4 | 5 | 6)[]} */
const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];
/** @type {('body' | 'large' | 'label' | 'supporting' | 'code')[]} */
const TEXT_TYPES = ['body', 'large', 'label', 'supporting', 'code'];
/** @type {('primary' | 'secondary' | 'accent' | 'disabled')[]} */
const TEXT_COLORS = ['primary', 'secondary', 'accent', 'disabled'];
/** @type {('primary' | 'secondary' | 'ghost' | 'destructive')[]} */
const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost', 'destructive'];
/** @type {('neutral' | 'info' | 'success' | 'warning' | 'error')[]} */
const SEMANTIC_BADGES = ['neutral', 'info', 'success', 'warning', 'error'];
/** @type {('blue' | 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow')[]} */
const CATEGORY_BADGES = [
  'blue',
  'cyan',
  'green',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'yellow',
];
/** @type {('default' | 'muted' | 'transparent')[]} */
const CARD_VARIANTS = ['default', 'muted', 'transparent'];

/**
 * @param {{ title: string, description?: string, children: import('react').ReactNode }} props
 */
function ShowcaseSection({ title, description, children }) {
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

export default function DesignSystemPage() {
  return (
    <Section variant="transparent" paddingBlock={8}>
      <VStack gap={0}>
        <VStack gap={2} paddingBlock={2}>
          <Heading level={1} type="display-2">
            Design system
          </Heading>
          <Text type="large" color="secondary">
            Component thật từ <code>@astryxdesign/core</code>, đã nối màu
            thương hiệu kt-xnk (đỏ #c2252a, teal #247768, theo tên role
            Material Design 3) qua <code>src/ui/theme.js</code>. Trang này
            không phải trang nội dung — dùng để soi màu/typo/variant khi
            thêm component mới.
          </Text>
        </VStack>

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

        <ShowcaseSection
          title="Button"
          description={
            'variant là mức nhấn mạnh, không phải màu brand: primary = đỏ (--color-accent), ' +
            'secondary = teal nhạt (override MD3 secondaryContainer), ghost = trong suốt, ' +
            'destructive = đỏ lỗi MD3 (--color-error), tách riêng khỏi đỏ thương hiệu.'
          }
        >
          <HStack gap={3} wrap="wrap" vAlign="center">
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} label={variant} variant={variant} />
            ))}
          </HStack>
          <HStack gap={3} wrap="wrap" vAlign="center">
            <Button label="Small" variant="primary" size="sm" />
            <Button label="Medium" variant="primary" size="md" />
            <Button label="Large" variant="primary" size="lg" />
            <Button label="Disabled" variant="primary" isDisabled />
            <Button label="Loading" variant="primary" isLoading />
          </HStack>
        </ShowcaseSection>

        <ShowcaseSection
          title="Badge"
          description="neutral/info/success/warning/error là màu trạng thái hệ thống (cố ý giữ mặc định Astryx — xanh lá/vàng/đỏ đã là quy ước phổ quát, không đổi theo brand). Các màu còn lại chỉ để phân loại/tag."
        >
          <VStack gap={3}>
            <HStack gap={2} wrap="wrap">
              {SEMANTIC_BADGES.map((variant) => (
                <Badge key={variant} label={variant} variant={variant} />
              ))}
            </HStack>
            <HStack gap={2} wrap="wrap">
              {CATEGORY_BADGES.map((variant) => (
                <Badge key={variant} label={variant} variant={variant} />
              ))}
            </HStack>
          </VStack>
        </ShowcaseSection>

        <ShowcaseSection
          title="Card"
          description="default dùng --color-background-card (MD3 surfaceContainer); muted dùng nền wash cho callout ít nổi bật hơn."
        >
          <HStack gap={3} wrap="wrap">
            {CARD_VARIANTS.map((variant) => (
              <Card key={variant} width={220} variant={variant}>
                <VStack gap={1}>
                  <Heading level={4}>{variant}</Heading>
                  <Text type="supporting" color="secondary">
                    variant=&quot;{variant}&quot;
                  </Text>
                </VStack>
              </Card>
            ))}
          </HStack>
        </ShowcaseSection>

        <ShowcaseSection
          title="Link"
          description="Link màu accent (đỏ thương hiệu) — trước khi nối --color-text-accent ở trên, link từng ra màu xám mặc định của theme-neutral."
        >
          <HStack gap={4} wrap="wrap">
            <Link href="/" isStandalone>
              Link nội bộ
            </Link>
            <Link href="https://github.com" isExternalLink isStandalone>
              Link ngoài (mở tab mới)
            </Link>
          </HStack>
        </ShowcaseSection>
      </VStack>
    </Section>
  );
}
