import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

async function requireAdmin(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    if (payload.role !== 'admin') return null;
    return payload;
  } catch { return null; }
}

export async function GET(req) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    users: users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      role: u.role,
      status: u.status,
      kycStatus: u.kycStatus,
      kycLevel: u.kycLevel,
      vipLevel: u.vipLevel,
      kycData: u.kycData || null,
      joinedDate: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    })),
  });
}
