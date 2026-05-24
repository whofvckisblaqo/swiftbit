import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/Transaction';
import { requireAdmin } from '@/lib/adminAuth';

export async function PATCH(req, { params }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { status, risk } = await req.json();

  const allowed = {};
  if (status) allowed.status = status;
  if (risk)   allowed.risk   = risk;

  await connectDB();
  const tx = await Transaction.findByIdAndUpdate(id, allowed, { new: true });
  if (!tx) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ transaction: tx.toJSON() });
}
