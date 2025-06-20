//app/api/stats/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Owner from '../../models/owners';
import Accommodation from '../../models/accommodations';

export async function GET() {
  await connectDb();

  const ownerCount = await Owner.countDocuments();
  const accommodationCount = await Accommodation.countDocuments();

  return NextResponse.json({ ownerCount, accommodationCount });
}
