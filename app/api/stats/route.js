import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Owner from '../../models/owners';
import Accommodation from '../../models/accomodation';

export async function GET() {
  await connectDb();

  const ownerCount = await Owner.countDocuments();
  const accommodationCount = await Accommodation.countDocuments();

  return NextResponse.json({ ownerCount, accommodationCount });
}
