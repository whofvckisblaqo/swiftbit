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

  const COINS = ['BTC', 'ETH', 'USDT_TRC20', 'USDT_ERC20', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA'];

  // Wallet addresses — merge individual coin keys
  if (body.walletAddresses && typeof body.walletAddresses === 'object') {
    for (const coin of COINS) {
      if (body.walletAddresses[coin] !== undefined) {
        update[`walletAddresses.${coin}`] = body.walletAddresses[coin];
      }
    }
  }

  // Wallet balances — merge individual coin amounts
  if (body.walletBalances && typeof body.walletBalances === 'object') {
    for (const coin of COINS) {
      if (body.walletBalances[coin] !== undefined) {
        update[`walletBalances.${coin}`] = parseFloat(body.walletBalances[coin]) || 0;
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
