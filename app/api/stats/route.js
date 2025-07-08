import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import Owner from '../../models/owners';
import Accommodation from '../../models/properties';
import Tax from '../../models/taxes';

export async function GET() {
  await connectDb();

  const ownersCount = await Owner.countDocuments();
  const accommodationsCount = await Accommodation.countDocuments();

  // totalTaxes = somme de "montant" sur tous les enregistrements
  const result = await Tax.aggregate([
    { $group: { _id: null, total: { $sum: "$montant" } } }
  ]);
  const totalTaxes = result[0]?.total ?? 0;

  return NextResponse.json({
    ownersCount,
    accommodationsCount,
    totalTaxes
  });
}
