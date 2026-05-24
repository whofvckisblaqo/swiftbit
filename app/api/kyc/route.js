import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

async function getUser(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    await connectDB();
    return await User.findById(payload.id);
  } catch { return null; }
}

export async function POST(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (user.kycStatus === 'verified') {
    return NextResponse.json({ error: 'Already verified' }, { status: 400 });
  }

  const { firstName, lastName, dateOfBirth, country, documentType, documentNumber } = await req.json();

  if (!firstName || !lastName || !dateOfBirth || !country || !documentType || !documentNumber) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  await connectDB();
  const updated = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        kycStatus: 'pending',
        kycData: { firstName, lastName, dateOfBirth, country, documentType, documentNumber, submittedAt: new Date() },
      },
    },
    { new: true }
  );

  return NextResponse.json({ user: updated.toSafeObject() });
}

export async function GET(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({
    kycStatus: user.kycStatus,
    kycSubmitted: !!(user.kycData?.submittedAt),
    kycData: user.kycStatus !== 'verified' ? user.kycData : null,
  });
}
