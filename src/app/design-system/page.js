import { Section } from '@astryxdesign/core/Section';
import { Heading, Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';

import { ActionsSection } from './sections/actions.js';
import { ContentSection } from './sections/content.js';
import { DataDisplaySection } from './sections/data-display.js';
import { FeedbackSection } from './sections/feedback.js';
import { FormsSection } from './sections/forms.js';
import { OverlaysSection } from './sections/overlays.js';
import { SelectionSection } from './sections/selection.js';
import { TypographySection } from './sections/typography.js';

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
            thương hiệu kt-xnk (teal #247768 làm primary, đỏ #c2252a làm
            secondary — theo tên role Material Design 3) qua{' '}
            <code>src/ui/theme.js</code>. Trang này
            không phải trang nội dung — dùng để soi màu/typo/variant khi
            thêm component mới. Chưa demo: Chat, PowerSearch, Calendar,
            DateInput, Carousel, Lightbox, TreeList, ContextMenu, MoreMenu,
            Markdown — phức tạp/cần dữ liệu ngoài, tra riêng qua{' '}
            <code>xds</code> MCP khi cần.
          </Text>
        </VStack>

        <TypographySection />
        <ActionsSection />
        <FormsSection />
        <SelectionSection />
        <FeedbackSection />
        <OverlaysSection />
        <DataDisplaySection />
        <ContentSection />
      </VStack>
    </Section>
  );
}
