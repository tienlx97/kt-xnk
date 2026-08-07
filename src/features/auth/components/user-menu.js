'use client';

import { Avatar } from '@astryxdesign/core/Avatar';
import { DropdownMenuItem } from '@astryxdesign/core/DropdownMenu';
import { Popover } from '@astryxdesign/core/Popover';
import { useState } from 'react';

import { useSession } from '../hooks/use-session.js';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, username, logout } = useSession();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="below"
      alignment="end"
      role="none"
      hasCloseButton={false}
      label="Menu tài khoản"
      content={
        <DropdownMenuItem
          label="Đăng xuất"
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
        />
      }>
      <Avatar name={username} size="sm" tooltip={false} onClick={() => {}} />
    </Popover>
  );
}
