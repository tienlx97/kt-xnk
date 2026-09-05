'use client';

import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Item } from '@astryxdesign/core/Item';
import { List } from '@astryxdesign/core/List';
import { Text } from '@astryxdesign/core/Text';
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
import { GripVertical, Plus, X } from 'lucide-react';
import { useId, useRef, useState } from 'react';
const styles = stylex.create({
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
/** @param {{ columns: ReadonlyArray<{key: string, label: string, isAlwaysVisible?: boolean}>, activeColumnKeys: string[], onChangeActiveColumnKeys: (keys: string[]) => void, defaultColumnKeys?: string[] }} props */
export function TableColumnsPanel({
  columns,
  activeColumnKeys,
  onChangeActiveColumnKeys,
  defaultColumnKeys,
}) {
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
          Nhấn Cách hoặc Enter để chọn cột, dùng phím mũi tên để di chuyển, Cách
          hoặc Enter để thả, Esc để huỷ.
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
                          isLocked ? 'Cột này luôn ở vị trí cố định' : undefined
                        }
                        icon={<Icon icon={GripVertical} size="sm" />}
                        xstyle={[styles.grip, isDragging && styles.gripActive]}
                        onKeyDown={(event) =>
                          !isLocked && handleGripKeyDown(event, key)
                        }
                        onPointerDown={(event) =>
                          !isLocked && handleGripPointerDown(event, key)
                        }
                        onPointerMove={(event) =>
                          !isLocked && handleGripPointerMove(event, key)
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
                        tooltip={isLocked ? 'Cột này luôn hiển thị' : undefined}
                        icon={<Icon icon={X} size="sm" />}
                        onClick={() =>
                          onChangeActiveColumnKeys(
                            activeColumnKeys.filter((k) => k !== key),
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
  );
}
