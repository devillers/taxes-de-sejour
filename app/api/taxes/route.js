// app/api/taxes/route.js
import { connectDb } from '../../lib/db';
import Tax from '../../models/taxes';

// Handler GET (liste toutes les taxes)
export async function GET() {
  await connectDb();
  const taxes = await Tax.find({}).lean();
  return Response.json(taxes);
}
