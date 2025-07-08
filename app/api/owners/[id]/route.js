//app/api/owners/[id]/route.js

import { NextResponse } from 'next/server';
import { connectDb } from '../../../lib/db';
import Owner from '../../../models/owners';

export async function PUT(req, { params }) {
  await connectDb();
  const id = params.id;
  const data = await req.json();
  await Owner.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json({ success: true });
}

export async function DELETE(req, { params }) {
  await connectDb();
  const id = params.id;
  await Owner.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
