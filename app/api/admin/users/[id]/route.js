import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { requireAdmin } from '@/lib/adminAuth';

export async function PATCH(req, { params }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const update = {};

  // Scalar fields
  if (body.status)    update.status    = body.status;
  if (body.kycStatus) update.kycStatus = body.kycStatus;
  if (body.kycLevel !== undefined) update.kycLevel = body.kycLevel;

  // Wallet addresses — merge individual coin keys
  if (body.walletAddresses && typeof body.walletAddresses === 'object') {
    const coins = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA'];
    for (const coin of coins) {
      if (body.walletAddresses[coin] !== undefined) {
        update[`walletAddresses.${coin}`] = body.walletAddresses[coin];
      }
    }
  }

  if (!Object.keys(update).length) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  await connectDB();
  const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ user: user.toSafeObject() });
}
