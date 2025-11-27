import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/actions/auth';
import { getUserDogs } from '@/app/lib/actions/dogs';
import HealthInsightsClientPage from './HealthInsightsClientPage';

export default async function HealthInsightsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/signin');
  }

  const dogs = await getUserDogs();

  return <HealthInsightsClientPage dogs={dogs} />;
}
