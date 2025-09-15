import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/actions/auth';
import { getUserDogs } from '@/app/lib/actions/dogs';
import { getVaccines } from '@/app/lib/actions/vaccinations';
import VaccinationsClientPage from '@/app/vaccinations/VaccinationsClientPage';

export default async function VaccinationsPage() {
  // Server-side data fetching
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/signin');
  }

  const dogs = await getUserDogs();
  const vaccines = await getVaccines();
  
  console.log('VaccinationsPage: Dogs count:', dogs.length);
  console.log('VaccinationsPage: Vaccines count:', vaccines.length);

  return (
    <VaccinationsClientPage 
      user={user}
      dogs={dogs}
      vaccines={vaccines}
    />
  );
}
