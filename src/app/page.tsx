import { redirect } from 'next/navigation';
import { routes } from '@/lib/config/routes';

export default function HomePage() {
  // Redirect to login for now
  // Later can be landing/marketing page
  redirect(routes.login);
}
