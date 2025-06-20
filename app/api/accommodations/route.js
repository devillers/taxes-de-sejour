import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Accommodation from '../../models/accommodations';

export async function GET() {
  await connectDb();
  const accommodations = await Accommodation.find().populate('owner').lean();
  return NextResponse.json(accommodations);
}

export async function POST(req) {
  try {
    await connectDb();
    const data = await req.json();
    const accommodation = await Accommodation.create(data);
    return NextResponse.json(accommodation, { status: 201 });
  } catch (err) {
    console.error('Error creating accommodation:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
