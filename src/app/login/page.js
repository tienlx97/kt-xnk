import { Suspense } from 'react';

import { LoginForm } from '../../features/auth/index.js';

export const metadata = {
  title: 'Đăng nhập · KT-XNK',
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
