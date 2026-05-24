import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { requireAdmin } from '@/lib/adminAuth';

export async function PATCH(req, { params }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const setUpdate = {};
  const incUpdate = {};

  // Scalar fields
  if (body.status)    setUpdate.status    = body.status;
  if (body.kycStatus) setUpdate.kycStatus = body.kycStatus;
  if (body.kycLevel !== undefined) setUpdate.kycLevel = body.kycLevel;

  const COINS = ['BTC', 'ETH', 'USDT_TRC20', 'USDT_ERC20', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA'];

  // Wallet addresses — always set (replace)
  if (body.walletAddresses && typeof body.walletAddresses === 'object') {
    for (const coin of COINS) {
      if (body.walletAddresses[coin] !== undefined) {
        setUpdate[`walletAddresses.${coin}`] = body.walletAddresses[coin];
      }
    }
  }

  // Wallet balances — increment so repeated fundings stack
  if (body.walletBalances && typeof body.walletBalances === 'object') {
    for (const coin of COINS) {
      const val = parseFloat(body.walletBalances[coin]);
      if (!isNaN(val) && val !== 0) {
        incUpdate[`walletBalances.${coin}`] = val;
      }
    }
  }

  if (!Object.keys(setUpdate).length && !Object.keys(incUpdate).length) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const mongoOp = {};
  if (Object.keys(setUpdate).length) mongoOp.$set = setUpdate;
  if (Object.keys(incUpdate).length) mongoOp.$inc = incUpdate;

  // Build a funding notification if any balances were added
  if (Object.keys(incUpdate).length) {
    const lines = Object.entries(incUpdate)
      .map(([key, val]) => `${val} ${key.replace('walletBalances.', '')}`)
      .join(', ');
    mongoOp.$push = {
      pendingNotifications: {
        title: 'Wallet Funded by Admin',
        body:  `Your wallet has been credited: ${lines}.`,
        type:  'account',
      },
    };
  }

  try {
    await connectDB();
    const user = await User.findByIdAndUpdate(id, mongoOp, { new: true, strict: false });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error('Admin user PATCH error:', err);
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}
