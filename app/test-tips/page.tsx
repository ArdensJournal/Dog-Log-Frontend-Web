import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/actions/auth';
import { getUserDogs } from '@/app/lib/actions/dogs';
import TestTipsClientPage from './TestTipsClientPage';

export default async function TestTipsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/signin');
  }

  const dogs = await getUserDogs();

  return <TestTipsClientPage dogs={dogs} />;
}
