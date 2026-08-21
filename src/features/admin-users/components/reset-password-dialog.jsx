'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { StackItem } from '@astryxdesign/core/Stack';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';
import { useState } from 'react';

import { IconShuffle } from '../../../shared/components/icon/icon-shuffle.jsx';
import { generateRandomPassword } from '../config/generate-password.js';
import { useResetPasswordMutation } from '../hooks/use-reset-password-mutation.js';

const MIN_PASSWORD_LENGTH = 8;

/**
 * Admin action: sets a new password for `user` directly, no current password
 * needed (`POST /users/{id}/password/reset` — see `api/users.js`). There is
 * no email/SMS delivery on the backend, so once this succeeds the new
 * password lives nowhere else — the success banner keeps it on screen so the
 * Admin can copy it before closing the dialog instead of losing it if they
 * dismiss too fast.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   user: { id: string, firstName: string, lastName: string },
 * }} props
 */
export function ResetPasswordDialog({ isOpen, onOpenChange, user }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetPasswordValue, setResetPasswordValue] = useState('');

  const resetPasswordMutation = useResetPasswordMutation(user.id);

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  /** @param {boolean} nextIsOpen */
  function handleOpenChange(nextIsOpen) {
    if (!nextIsOpen) {
      // Cleared on close, not on open: reopening right after a successful
      // reset (e.g. the Admin realizes they need to re-copy it) would
      // otherwise start from a blank field for no reason.
      setPassword('');
      setError('');
      setResetPasswordValue('');
    }
    onOpenChange(nextIsOpen);
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} event */
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (password.trim().length < MIN_PASSWORD_LENGTH) {
      setError(`Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`);
      return;
    }

    const result = await resetPasswordMutation.mutateAsync(password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setResetPasswordValue(password);
    setPassword('');
  }

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      purpose="form"
      width={440}
    >
      <form onSubmit={handleSubmit}>
        <Layout
          header={
            <DialogHeader
              title="Đặt lại mật khẩu"
              subtitle={fullName || undefined}
              onOpenChange={handleOpenChange}
            />
          }
          content={
            <LayoutContent padding={6}>
              <VStack gap={3} hAlign="stretch">
                {error ? (
                  <Banner status="error" title={error} container="card" />
                ) : null}

                {resetPasswordValue ? (
                  <Banner
                    status="success"
                    title="Đã đặt lại mật khẩu"
                    description={`Mật khẩu mới: ${resetPasswordValue}. Hãy gửi mật khẩu này cho nhân viên — hệ thống không lưu lại và không gửi email/SMS.`}
                    container="card"
                  />
                ) : (
                  <HStack gap={2}>
                    <StackItem size="fill">
                      <TextInput
                        label="Mật khẩu mới"
                        value={password}
                        onChange={setPassword}
                        type="text"
                        placeholder="Tối thiểu 8 ký tự, có hoa/thường/số/ký tự đặc biệt"
                        isRequired
                      />
                    </StackItem>
                    <StackItem crossAlignSelf="end">
                      <IconButton
                        label="Tạo mật khẩu ngẫu nhiên"
                        tooltip="Ngẫu nhiên"
                        icon={<Icon icon={IconShuffle} size="sm" />}
                        type="button"
                        variant="secondary"
                        onClick={() => setPassword(generateRandomPassword())}
                      />
                    </StackItem>
                  </HStack>
                )}
              </VStack>
            </LayoutContent>
          }
          footer={
            <LayoutFooter>
              <HStack hAlign="end" gap={2}>
                {resetPasswordValue ? (
                  <Button
                    label="Đóng"
                    type="button"
                    variant="primary"
                    onClick={() => handleOpenChange(false)}
                  />
                ) : (
                  <>
                    <Button
                      label="Hủy"
                      type="button"
                      variant="secondary"
                      onClick={() => handleOpenChange(false)}
                    />
                    <Button
                      label="Đặt lại mật khẩu"
                      type="submit"
                      variant="primary"
                      isLoading={resetPasswordMutation.isPending}
                    />
                  </>
                )}
              </HStack>
            </LayoutFooter>
          }
        />
      </form>
    </Dialog>
  );
}
