import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Loan from '@/models/Loan';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();
  const loans = await Loan.find({}).sort({ createdAt: -1 });

  const [active, atRisk, defaulted] = await Promise.all([
    Loan.countDocuments({ status: 'active' }),
    Loan.countDocuments({ health: { $in: ['warning', 'danger'] } }),
    Loan.countDocuments({ status: 'defaulted' }),
  ]);

  const outstanding = await Loan.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: null, total: { $sum: '$loanAmount' } } },
  ]);

  return NextResponse.json({
    loans: loans.map(l => l.toJSON()),
    stats: {
      active,
      atRisk,
      defaulted,
      outstanding: outstanding[0]?.total || 0,
    },
  });
}
