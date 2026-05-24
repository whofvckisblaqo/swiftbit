import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SupportTicket from '@/models/SupportTicket';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();
  const tickets = await SupportTicket.find({}).sort({ createdAt: -1 });

  const [open, inProgress, resolved] = await Promise.all([
    SupportTicket.countDocuments({ status: 'open' }),
    SupportTicket.countDocuments({ status: 'in-progress' }),
    SupportTicket.countDocuments({ status: 'resolved' }),
  ]);

  return NextResponse.json({
    tickets: tickets.map(t => t.toJSON()),
    stats: { open, inProgress, resolved },
  });
}
