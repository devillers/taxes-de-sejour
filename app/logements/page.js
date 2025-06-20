export const dynamic = 'force-dynamic';

import { connectDb } from '@/lib/db';
import Accommodation from '@/models/accomodations';
import LogementManager from './LogementManager';

export default async function LogementsPage() {
  await connectDb();
  const accommodations = await Accommodation.find().lean();
  return (
    <div className="p-8">
      <LogementManager initialAccommodations={accommodations} />
    </div>
  );
}
