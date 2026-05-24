import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Loan from '@/models/Loan';
import { requireAdmin } from '@/lib/adminAuth';

export async function PATCH(req, { params }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const allowed = ['status', 'health'];
  const update = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

  await connectDB();
  const loan = await Loan.findByIdAndUpdate(id, update, { new: true });
  if (!loan) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ loan: loan.toJSON() });
}
