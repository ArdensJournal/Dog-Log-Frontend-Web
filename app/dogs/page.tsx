import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/actions/auth';
import { getUserDogs } from '@/app/lib/actions/dogs';
import DogsClientPage from './DogsClientPage';

export default async function DogsPage() {
  // Server-side data fetching
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/signin');
  }

  const dogs = await getUserDogs();

  return (
    <DogsClientPage 
      dogs={dogs}
    />
  );
}