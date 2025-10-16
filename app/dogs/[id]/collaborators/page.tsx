import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/actions/auth';
import { getDogById } from '@/app/lib/actions/dogs';
import CollaboratorsClientPage from '@/app/dogs/[id]/collaborators/CollaboratorsClientPage';

interface CollaboratorsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CollaboratorsPage({ params }: CollaboratorsPageProps) {
  // Await params as required by Next.js 15
  const { id } = await params;
  
  // Server-side data fetching
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/signin');
  }

  const dog = await getDogById(id);

  if (!dog) {
    redirect('/dogs');
  }

  return (
    <CollaboratorsClientPage 
      dog={dog}
    />
  );
}
