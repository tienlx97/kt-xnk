import { redirect } from 'next/navigation';

// `/admin` has exactly one feature today — user management — so the index
// route just forwards there instead of rendering a landing page with a
// single link. Add a real dashboard once a second admin feature exists.
export default function AdminPage() {
  redirect('/admin/users');
}
