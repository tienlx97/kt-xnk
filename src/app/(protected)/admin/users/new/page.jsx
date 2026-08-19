import { redirect } from 'next/navigation';

// Creating a user now happens inline from `/admin/users` via the "Tạo mới"
// dialog (see `features/admin-users/components/user-list.jsx`) instead of
// a dedicated full page — redirect rather than delete the route outright,
// so an old bookmark/link still lands somewhere useful.
export default function CreateUserRedirectPage() {
  redirect('/admin/users');
}
