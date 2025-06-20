import { NextResponse } from 'next/server';
import { connectDb } from '../../../lib/db';
import Accommodation from '../../../models/accommodations';

export async function GET(req, { params }) {
  await connectDb();
  const acc = await Accommodation.findById(params.id).populate('owner').lean();
  if (!acc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(acc);
}

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const data = await req.json();
    const updated = await Accommodation.findByIdAndUpdate(params.id, data, { new: true });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Error updating accommodation:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb();
    await Accommodation.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting accommodation:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
