import { NextResponse } from 'next/server';
import { seedVaccines } from '@/app/lib/seedVaccines';

export async function GET() {
  await seedVaccines();
  return NextResponse.json({ message: 'Vaccines seeded' });
}
