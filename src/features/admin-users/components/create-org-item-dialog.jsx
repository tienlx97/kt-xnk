'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';
import { useState } from 'react';

/**
 * Generic "add a new X" dialog reused by all four org-directory Selectors in
 * `UserOrgFields` (Công ty/Chi nhánh/Phòng ban/Chức vụ). One shape covers all
 * four because every backend create endpoint behind them
 * (`CreateCompanyCommand`/`CreateBranchCommand`/`CreateDepartmentCommand`/
 * `CreatePositionCommand`) takes only a `Name` — any parent id (company for a
 * branch, branch for a department) is already known from the Selector the
 * person opened this from, not something they re-enter here.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   title: string,
 *   label: string,
 *   isSubmitting: boolean,
 *   onSubmit: (name: string) => Promise<{ success: true, id?: string } | { success: false, message: string }>,
 *   onCreated: (id: string) => void,
 * }} props
 */
export function CreateOrgItemDialog({
  isOpen,
  onOpenChange,
  title,
  label,
  isSubmitting,
  onSubmit,
  onCreated,
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  /** @param {boolean} nextIsOpen */
  function handleOpenChange(nextIsOpen) {
    if (!nextIsOpen) {
      setName('');
      setError('');
    }
    onOpenChange(nextIsOpen);
  }

  async function handleSubmit() {
    setError('');

    if (!name.trim()) {
      setError('Vui lòng nhập tên');
      return;
    }

    const result = await onSubmit(name.trim());

    if (!result.success) {
      setError(result.message);
      return;
    }

    if (result.id) onCreated(result.id);
    handleOpenChange(false);
  }

  return (
    <Dialog isOpen={isOpen} onOpenChange={handleOpenChange} purpose="form" width={400}>
      {/* Deliberately no <form>/type="submit" here: `UserOrgFields` renders
          this dialog nested inside the create/edit user dialog's own
          <form>. Astryx's `Dialog` is a native <dialog> element rendered
          inline (no portal), so a second <form> here would be a form nested
          inside a form — invalid HTML that the browser's parser resolves by
          dropping this inner <form> tag entirely, silently merging "Thêm"
          into the OUTER form. That earlier bug submitted (and closed) the
          whole user-edit dialog instead of creating this item. A plain
          button + onClick sidesteps the nesting rule outright. */}
      <Layout
        header={<DialogHeader title={title} onOpenChange={handleOpenChange} />}
        content={
          <LayoutContent padding={6}>
            <VStack gap={3} hAlign="stretch">
              {error ? (
                <Banner status="error" title={error} container="card" />
              ) : null}
              <TextInput label={label} value={name} onChange={setName} isRequired />
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack hAlign="end" gap={2}>
              <Button
                label="Hủy"
                type="button"
                variant="secondary"
                onClick={() => handleOpenChange(false)}
              />
              <Button
                label="Thêm"
                type="button"
                variant="primary"
                isLoading={isSubmitting}
                onClick={handleSubmit}
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
