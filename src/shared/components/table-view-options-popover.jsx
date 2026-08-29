'use client';

import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Item } from '@astryxdesign/core/Item';
import { List } from '@astryxdesign/core/List';
import { Popover } from '@astryxdesign/core/Popover';
import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList';
import { Section } from '@astryxdesign/core/Section';
import { StackItem } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
import {
  borderVars,
  colorVars,
  durationVars,
  easeVars,
  spacingVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import { VisuallyHidden } from '@astryxdesign/core/VisuallyHidden';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import {
  AlignJustify,
  GripVertical,
  Pin,
  Plus,
  X,
} from 'lucide-react';
import { useId, useRef, useState } from 'react';

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Gọn' },
  { value: 'balanced', label: 'Vừa' },
  { value: 'spacious', label: 'Rộng' },
];

const STICKY_START_OPTIONS = [
  { value: 'none', label: 'Không ghim' },
  { value: 'one', label: 'Cột đầu tiên' },
  { value: 'two', label: 'Hai cột đầu tiên' },
];

const STICKY_END_OPTIONS = [
  { value: 'none', label: 'Không ghim' },
  { value: 'one', label: 'Cột cuối cùng' },
  { value: 'two', label: 'Hai cột cuối cùng' },
];

const SECTIONS = [
  { key: 'columns', label: 'Cột hiển thị', title: 'Cột hiển thị' },
  { key: 'density', label: 'Mật độ dòng', title: 'Mật độ dòng' },
  { key: 'sticky', label: 'Ghim cột', title: 'Ghim cột' },
];

const styles = stylex.create({
  // Flush like the popover this pattern is drawn from: the rail's divider
  // then runs the full height of the body, and the rail/pane each restate
  // their own gutter instead of sharing the popover's.
  surface: {
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
  },
  body: {
    blockSize: 400,
  },
  rail: {
    flexShrink: 0,
    width: 176,
  },
  railItem: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  // `pane` sits in a `StackItem`, which is a block box, not a flex
  // container — `flexGrow` does nothing there, so without a definite
  // height this sizes to its content instead of the popover's fixed
  // `body` height, and every `overflowY: auto` below it has nothing to
  // clip against.
  pane: {
    blockSize: '100%',
    minWidth: 0,
  },
  // The two column panels split the pane in half, each scrolling its own
  // rows within whatever height the pane gives them — many columns lengthen
  // a list instead of growing the popover past the viewport.
  transferPanels: {
    flexGrow: 1,
    minHeight: 0,
  },
  transferPanel: {
    flexBasis: 0,
    flexGrow: 1,
    minBlockSize: 0,
    minWidth: 0,
    overflow: 'hidden',
  },
  transferPanelDivider: {
    borderInlineStartColor: colorVars['--color-border'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: borderVars['--border-width'],
  },
  transferPanelHeader: {
    borderBlockEndColor: colorVars['--color-border'],
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: borderVars['--border-width'],
  },
  transferPanelBody: {
    flexGrow: 1,
    minBlockSize: 0,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
  },
  transferEmpty: {
    textAlign: 'center',
  },
  transferItem: {
    paddingInline: spacingVars['--spacing-4'],
    transitionDuration: {
      default: durationVars['--duration-fast'],
      '@media (prefers-reduced-motion: reduce)': '0s',
    },
    transitionProperty: 'background-color',
    transitionTimingFunction: easeVars['--ease-standard'],
  },
  // The row under the pointer mid-drag: lifted off the list visually so it
  // reads as "in flight" rather than as a row that just got a new
  // background wash like hover/selected would.
  transferItemDragging: {
    backgroundColor: colorVars['--color-overlay-pressed'],
    opacity: 0.6,
  },
  // A keyboard pick-up has no pointer under it to say what is moving, so the
  // row itself carries the state.
  transferItemPicked: {
    backgroundColor: colorVars['--color-accent-muted'],
  },
  transferHeaderAction: {
    height: 'auto',
    paddingBlock: 0,
    paddingInline: 0,
  },
  // A ghost IconButton insets its glyph by its own padding; cancelling that
  // puts the grip itself on the row's start line rather than the button box.
  grip: {
    cursor: 'grab',
    marginInlineStart: `calc(-1 * ${spacingVars['--spacing-1-5']})`,
    touchAction: 'none',
  },
  gripActive: {
    cursor: 'grabbing',
  },
});

/**
 * Computes which column keys land on a pinned edge, given the edge setting
 * and the table's current (visible, ordered) column keys — the contiguous
 * run from that edge inward. Shared by every list that offers sticky
 * columns through {@link TableViewOptionsPopover}, so the popover's choice
 * and the `useTableStickyColumns` call agree on what "first/last column(s)"
 * means.
 * @param {'none' | 'one' | 'two'} edge
 * @param {readonly string[]} columnKeys
 * @param {boolean} fromEnd
 * @returns {string[]}
 */
export function stickyColumnKeys(edge, columnKeys, fromEnd) {
  const count = edge === 'two' ? 2 : edge === 'one' ? 1 : 0;
  if (count === 0) {
    return [];
  }
  return fromEnd ? columnKeys.slice(-count) : columnKeys.slice(0, count);
}

/**
 * Moves `key` from its current position to `targetIndex`, leaving the
 * relative order of every other key unchanged.
 * @param {string[]} keys
 * @param {string} key
 * @param {number} targetIndex
 * @returns {string[]}
 */
function moveKeyTo(keys, key, targetIndex) {
  const currentIndex = keys.indexOf(key);
  if (currentIndex === -1 || currentIndex === targetIndex) {
    return keys;
  }
  const next = [...keys];
  next.splice(currentIndex, 1);
  next.splice(targetIndex, 0, key);
  return next;
}

/**
 * Consolidated "View options" trigger: columns, row density, and sticky
 * columns behind one popover with a section rail, instead of three separate
 * toolbar controls. Mirrors the reference table template's View options
 * panel (rail + pane), scoped to the sections this project's tables
 * actually use — no saved-view grouping section, since these lists have no
 * grouping feature.
 *
 * The Columns section mirrors the template's two-panel transfer list
 * (Displayed / Available) rather than a single checkbox list: these tables
 * load rows with many fields, and a flat checkbox list of a dozen-plus
 * columns is harder to scan than seeing what's on and what's off at a
 * glance, with drag-to-reorder available on the displayed side.
 * @param {{
 *   columns: ReadonlyArray<{ key: string, label: string, isAlwaysVisible?: boolean }>,
 *   activeColumnKeys: string[],
 *   onChangeActiveColumnKeys: (keys: string[]) => void,
 *   defaultColumnKeys?: string[],
 *   density: string,
 *   onChangeDensity: (value: string) => void,
 *   stickyStart: string,
 *   onChangeStickyStart: (value: string) => void,
 *   stickyEnd: string,
 *   onChangeStickyEnd: (value: string) => void,
 * }} props
 */
export function TableViewOptionsPopover({
  columns,
  activeColumnKeys,
  onChangeActiveColumnKeys,
  defaultColumnKeys,
  density,
  onChangeDensity,
  stickyStart,
  onChangeStickyStart,
  stickyEnd,
  onChangeStickyEnd,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [section, setSection] = useState(
    /** @type {'columns' | 'density' | 'sticky'} */ ('columns'),
  );
  // Pointer drag in progress, by key — driven off the grip's own pointer
  // events rather than native HTML5 drag-and-drop, so there's no browser
  // drag-ghost image or drop-effect cursor to fight with.
  const [dragKey, setDragKey] = useState(/** @type {string | null} */ (null));
  // Keyboard pick-up in progress, by key — Space/Enter picks up, the arrow
  // keys move it, Space/Enter drops, Escape cancels back to the snapshot.
  const [pickedKey, setPickedKey] = useState(
    /** @type {string | null} */ (null),
  );
  const pickupSnapshotRef = useRef(/** @type {string[] | null} */ (null));
  const rowRefs = useRef(/** @type {Map<string, HTMLElement>} */ (new Map()));
  const reorderHintId = useId();

  const activeSection = SECTIONS.find((item) => item.key === section);
  const columnLabels = Object.fromEntries(
    columns.map((column) => [column.key, column.label]),
  );
  const restoreKeys = defaultColumnKeys ?? columns.map((column) => column.key);
  const availableColumns = columns.filter(
    (column) => !activeColumnKeys.includes(column.key),
  );

  /**
   * Reads the pointer's Y position against every displayed row's current
   * bounding box and reorders `dragKey` to whichever slot it's hovering —
   * called on every pointermove, so the list visibly shuffles as the row
   * travels rather than only snapping once on drop.
   * @param {number} clientY
   * @param {string} key
   */
  function reorderToPointer(clientY, key) {
    const keys = activeColumnKeys;
    let targetIndex = keys.length - 1;
    for (let i = 0; i < keys.length; i += 1) {
      const node = rowRefs.current.get(keys[i]);
      if (node == null) {
        continue;
      }
      const rect = node.getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) {
        targetIndex = i;
        break;
      }
    }
    const next = moveKeyTo(keys, key, targetIndex);
    if (next !== keys) {
      onChangeActiveColumnKeys(next);
    }
  }

  /**
   * @param {import('react').PointerEvent<HTMLElement>} event
   * @param {string} key
   */
  function handleGripPointerDown(event, key) {
    // Only the primary button/touch starts a drag; a right-click grip
    // press shouldn't pick the row up.
    if (event.button !== 0) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragKey(key);
  }

  /**
   * @param {import('react').PointerEvent<HTMLElement>} event
   * @param {string} key
   */
  function handleGripPointerMove(event, key) {
    if (dragKey !== key) {
      return;
    }
    reorderToPointer(event.clientY, key);
  }

  /**
   * @param {import('react').PointerEvent<HTMLElement>} event
   */
  function endPointerDrag(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragKey(null);
  }

  /**
   * @param {import('react').KeyboardEvent<HTMLElement>} event
   * @param {string} key
   */
  function handleGripKeyDown(event, key) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (pickedKey === key) {
        setPickedKey(null);
        pickupSnapshotRef.current = null;
      } else {
        pickupSnapshotRef.current = [...activeColumnKeys];
        setPickedKey(key);
      }
      return;
    }
    if (pickedKey !== key) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      if (pickupSnapshotRef.current != null) {
        onChangeActiveColumnKeys(pickupSnapshotRef.current);
      }
      setPickedKey(null);
      pickupSnapshotRef.current = null;
      return;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const index = activeColumnKeys.indexOf(key);
      const target = event.key === 'ArrowUp' ? index - 1 : index + 1;
      if (target >= 0 && target < activeColumnKeys.length) {
        onChangeActiveColumnKeys(moveKeyTo(activeColumnKeys, key, target));
      }
    }
  }

  return (
    <Popover
      placement="below"
      alignment="end"
      width={680}
      label="Tuỳ chọn hiển thị"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      xstyle={styles.surface}
      content={
        <HStack gap={0} xstyle={styles.body}>
          <Section
            variant="transparent"
            padding={1}
            dividers={['end']}
            xstyle={styles.rail}
          >
            <VStack gap={1}>
              <Button
                label="Cột hiển thị"
                variant={section === 'columns' ? 'secondary' : 'ghost'}
                icon={<Icon icon="viewColumns" size="sm" />}
                xstyle={styles.railItem}
                onClick={() => setSection('columns')}
              />
              <Button
                label="Mật độ dòng"
                variant={section === 'density' ? 'secondary' : 'ghost'}
                icon={<Icon icon={AlignJustify} size="sm" />}
                xstyle={styles.railItem}
                onClick={() => setSection('density')}
              />
              <Button
                label="Ghim cột"
                variant={section === 'sticky' ? 'secondary' : 'ghost'}
                icon={<Icon icon={Pin} size="sm" />}
                xstyle={styles.railItem}
                onClick={() => setSection('sticky')}
              />
            </VStack>
          </Section>

          <StackItem size="fill">
            <VStack gap={0} minHeight={0} xstyle={styles.pane}>
              {section !== 'columns' ? (
                <VStack gap={0} padding={4} paddingBlockEnd={3}>
                  <Heading level={3}>{activeSection?.title}</Heading>
                </VStack>
              ) : null}

              {section === 'columns' ? (
                <HStack gap={0} minHeight={0} xstyle={styles.transferPanels}>
                  <VStack
                    gap={0}
                    role="group"
                    aria-label="Cột đang hiển thị"
                    xstyle={styles.transferPanel}
                  >
                    <HStack
                      gap={2}
                      vAlign="center"
                      hAlign="between"
                      padding={4}
                      paddingBlock={3}
                      xstyle={styles.transferPanelHeader}
                    >
                      <Text type="label" color="secondary">
                        Đang hiển thị
                      </Text>
                      <Button
                        label="Khôi phục"
                        variant="ghost"
                        size="sm"
                        xstyle={styles.transferHeaderAction}
                        onClick={() => onChangeActiveColumnKeys([...restoreKeys])}
                      />
                    </HStack>
                    <VisuallyHidden id={reorderHintId}>
                      Nhấn Cách hoặc Enter để chọn cột, dùng phím mũi tên để
                      di chuyển, Cách hoặc Enter để thả, Esc để huỷ.
                    </VisuallyHidden>
                    <VStack gap={0} xstyle={styles.transferPanelBody}>
                      {activeColumnKeys.length === 0 ? (
                        <VStack
                          gap={0}
                          vAlign="center"
                          hAlign="center"
                          minHeight="100%"
                          paddingBlock={4}
                          xstyle={styles.transferEmpty}
                        >
                          <Text type="supporting" color="secondary">
                            Chưa có cột nào được hiển thị.
                          </Text>
                        </VStack>
                      ) : (
                        <List
                          density="compact"
                          header={<VisuallyHidden>Đang hiển thị</VisuallyHidden>}
                        >
                          {activeColumnKeys.map((key) => {
                            const column = columns.find((c) => c.key === key);
                            const isLocked = column?.isAlwaysVisible === true;
                            const label = columnLabels[key] ?? key;
                            const isDragging = dragKey === key;
                            const isPicked = pickedKey === key;
                            return (
                              <Item
                                key={key}
                                as="li"
                                density="compact"
                                label={label}
                                ref={(node) => {
                                  if (node == null) {
                                    rowRefs.current.delete(key);
                                  } else {
                                    rowRefs.current.set(key, node);
                                  }
                                }}
                                xstyle={[
                                  styles.transferItem,
                                  isDragging && styles.transferItemDragging,
                                  isPicked && styles.transferItemPicked,
                                ]}
                                startContent={
                                  <IconButton
                                    label={`Kéo để sắp xếp lại ${label}`}
                                    aria-describedby={reorderHintId}
                                    aria-pressed={isPicked}
                                    variant="ghost"
                                    size="sm"
                                    isDisabled={isLocked}
                                    tooltip={
                                      isLocked
                                        ? 'Cột này luôn ở vị trí cố định'
                                        : undefined
                                    }
                                    icon={<Icon icon={GripVertical} size="sm" />}
                                    xstyle={[
                                      styles.grip,
                                      isDragging && styles.gripActive,
                                    ]}
                                    onKeyDown={(event) =>
                                      !isLocked && handleGripKeyDown(event, key)
                                    }
                                    onPointerDown={(event) =>
                                      !isLocked &&
                                      handleGripPointerDown(event, key)
                                    }
                                    onPointerMove={(event) =>
                                      !isLocked &&
                                      handleGripPointerMove(event, key)
                                    }
                                    onPointerUp={endPointerDrag}
                                    onPointerCancel={endPointerDrag}
                                    onLostPointerCapture={endPointerDrag}
                                  />
                                }
                                endContent={
                                  <IconButton
                                    label={`Bỏ hiển thị ${label}`}
                                    variant="ghost"
                                    size="sm"
                                    isDisabled={isLocked}
                                    tooltip={
                                      isLocked
                                        ? 'Cột này luôn hiển thị'
                                        : undefined
                                    }
                                    icon={<Icon icon={X} size="sm" />}
                                    onClick={() =>
                                      onChangeActiveColumnKeys(
                                        activeColumnKeys.filter(
                                          (k) => k !== key,
                                        ),
                                      )
                                    }
                                  />
                                }
                              />
                            );
                          })}
                        </List>
                      )}
                    </VStack>
                  </VStack>

                  <VStack
                    gap={0}
                    role="group"
                    aria-label="Cột có thể thêm"
                    xstyle={[styles.transferPanel, styles.transferPanelDivider]}
                  >
                    <HStack
                      gap={2}
                      vAlign="center"
                      hAlign="between"
                      padding={4}
                      paddingBlock={3}
                      xstyle={styles.transferPanelHeader}
                    >
                      <Text type="label" color="secondary">
                        Có thể thêm
                      </Text>
                      <Button
                        label="Chọn tất cả"
                        variant="ghost"
                        size="sm"
                        xstyle={styles.transferHeaderAction}
                        isDisabled={availableColumns.length === 0}
                        onClick={() =>
                          onChangeActiveColumnKeys([
                            ...activeColumnKeys,
                            ...availableColumns.map((column) => column.key),
                          ])
                        }
                      />
                    </HStack>
                    <VStack gap={0} xstyle={styles.transferPanelBody}>
                      {availableColumns.length === 0 ? (
                        <VStack
                          gap={0}
                          vAlign="center"
                          hAlign="center"
                          minHeight="100%"
                          paddingBlock={4}
                          xstyle={styles.transferEmpty}
                        >
                          <Text type="supporting" color="secondary">
                            Tất cả cột đã được hiển thị.
                          </Text>
                        </VStack>
                      ) : (
                        <List
                          density="compact"
                          header={<VisuallyHidden>Có thể thêm</VisuallyHidden>}
                        >
                          {availableColumns.map((column) => (
                            <Item
                              key={column.key}
                              as="li"
                              density="compact"
                              label={column.label}
                              xstyle={styles.transferItem}
                              endContent={
                                <IconButton
                                  label={`Hiển thị ${column.label}`}
                                  variant="ghost"
                                  size="sm"
                                  icon={<Icon icon={Plus} size="sm" />}
                                  onClick={() =>
                                    onChangeActiveColumnKeys([
                                      ...activeColumnKeys,
                                      column.key,
                                    ])
                                  }
                                />
                              }
                            />
                          ))}
                        </List>
                      )}
                    </VStack>
                  </VStack>
                </HStack>
              ) : null}

              {section === 'density' ? (
                <VStack gap={0} paddingInline={4} paddingBlockEnd={4}>
                  <RadioList
                    label="Mật độ dòng"
                    isLabelHidden
                    value={density}
                    onChange={onChangeDensity}
                  >
                    {DENSITY_OPTIONS.map((option) => (
                      <RadioListItem
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </RadioList>
                </VStack>
              ) : null}

              {section === 'sticky' ? (
                <VStack gap={4} paddingInline={4} paddingBlockEnd={4}>
                  <RadioList
                    label="Ghim từ đầu bảng"
                    value={stickyStart}
                    onChange={onChangeStickyStart}
                  >
                    {STICKY_START_OPTIONS.map((option) => (
                      <RadioListItem
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </RadioList>
                  <RadioList
                    label="Ghim từ cuối bảng"
                    value={stickyEnd}
                    onChange={onChangeStickyEnd}
                  >
                    {STICKY_END_OPTIONS.map((option) => (
                      <RadioListItem
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </RadioList>
                </VStack>
              ) : null}
            </VStack>
          </StackItem>
        </HStack>
      }
    >
      <Button
        label="Tuỳ chọn hiển thị"
        variant="ghost"
        size="sm"
        endContent={<Icon icon="chevronDown" size="sm" />}
      />
    </Popover>
  );
}
