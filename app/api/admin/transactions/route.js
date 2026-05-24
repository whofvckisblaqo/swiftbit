import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/Transaction';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const type   = searchParams.get('type');   // comma-separated e.g. "buy,sell"
  const status = searchParams.get('status');
  const limit  = parseInt(searchParams.get('limit') || '100');

  await connectDB();

  const filter = {};
  if (type)   filter.type   = { $in: type.split(',') };
  if (status) filter.status = status;

  const txs = await Transaction.find(filter).sort({ createdAt: -1 }).limit(limit);

  const [total, completed, pending, failed] = await Promise.all([
    Transaction.countDocuments(filter),
    Transaction.countDocuments({ ...filter, status: 'completed' }),
    Transaction.countDocuments({ ...filter, status: 'pending' }),
    Transaction.countDocuments({ ...filter, status: 'failed' }),
  ]);

  const volume = await Transaction.aggregate([
    { $match: { ...filter, status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  return NextResponse.json({
    transactions: txs.map(t => t.toJSON()),
    stats: {
      total,
      completed,
      pending,
      failed,
      volume: volume[0]?.total || 0,
    },
  });
}
