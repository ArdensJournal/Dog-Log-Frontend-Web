import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/actions/auth';
import NotificationsClientPage from './NotificationsClientPage';

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/signin');
  }

  return <NotificationsClientPage />;
}
