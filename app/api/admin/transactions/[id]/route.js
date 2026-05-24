import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { requireAdmin } from '@/lib/adminAuth';
import { sendTransactionStatusEmail } from '@/lib/mailer';

export async function PATCH(req, { params }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { status, risk } = await req.json();

  await connectDB();
  const tx = await Transaction.findById(id);
  if (!tx) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (risk) tx.risk = risk;

  if (status && status !== tx.status) {
    // Apply balance changes only when approving a pending transaction
    if (status === 'completed' && tx.status === 'pending') {
      const inc = {};

      if (tx.type === 'buy') {
        inc[`walletBalances.${tx.symbol}`] = tx.qty;
      } else if (tx.type === 'send' || tx.type === 'withdrawal') {
        inc[`walletBalances.${tx.symbol}`] = -tx.qty;
      } else if (tx.type === 'swap') {
        inc[`walletBalances.${tx.symbol}`] = -tx.qty;
        if (tx.toSymbol && tx.toQty) {
          inc[`walletBalances.${tx.toSymbol}`] = tx.toQty;
        }
      }

      if (Object.keys(inc).length > 0) {
        await User.findByIdAndUpdate(tx.userId, { $inc: inc });
      }
    }

    tx.status = status;
  }

  await tx.save();

  // Email user on approval or rejection (fire-and-forget)
  if (status && (status === 'completed' || status === 'failed')) {
    const user = await User.findById(tx.userId).catch(() => null);
    if (user) {
      sendTransactionStatusEmail(user.email, user.name, tx.toJSON()).catch(console.error);
    }
  }

  return NextResponse.json({ transaction: tx.toJSON() });
}
