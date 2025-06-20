// app/logements/page.js

export const dynamic = 'force-dynamic';

import { connectDb } from '../lib/db';
import Accommodation from '../models/accomodations';
import LogementManager from './LogementManager';

export default async function LogementsPage() {
  // 1) Ensure DB is connected
  await connectDb();

  // 2) Fetch as plain JS objects
  const raw = await Accommodation.find()
    .populate('owner')
    .lean();

  // 3) Convert ObjectIds and Dates into strings/ISO formats
  const accommodations = raw.map(doc => ({
    ...doc,
    _id: doc._id.toString(),
    localite: doc.localite,
    owner: doc.owner
      ? {
          ...doc.owner,
          _id: doc.owner._id.toString(),
          createdAt: doc.owner.createdAt.toISOString(),
          updatedAt: doc.owner.updatedAt.toISOString(),
        }
      : null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  }));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestion des logements</h1>
      {/* Now safe to pass only plain JS objects */}
      <LogementManager initialAccommodations={accommodations} />
    </div>
  );
}
