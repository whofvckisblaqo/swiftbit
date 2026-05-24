import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/Transaction';
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

  const body = await req.json();
  const { type, amount, coin, symbol, qty, price, method, address, fee } = body;

  if (!type || !amount || !coin || !symbol) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await connectDB();
  const tx = await Transaction.create({
    userId:    user._id,
    userName:  user.name,
    userEmail: user.email,
    type,
    amount,
    coin,
    symbol,
    qty:    qty    || 0,
    price:  price  || 0,
    method: method || '',
    address:address || '',
    fee:    fee    || 0,
    status: 'completed',
    risk:   amount > 10000 ? 'medium' : 'low',
  });

  return NextResponse.json({ transaction: tx.toJSON() }, { status: 201 });
}

export async function GET(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const txs = await Transaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50);
  return NextResponse.json({ transactions: txs.map(t => t.toJSON()) });
}
