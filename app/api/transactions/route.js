import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { sendTransactionPendingEmail } from '@/lib/mailer';

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
  const { type, amount, coin, symbol, qty, price, method, address, fee, toSymbol, toQty } = body;

  if (!type || !amount || !coin || !symbol) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (typeof amount === 'number' && amount < 0) {
    return NextResponse.json({ error: 'Invalid transaction amount' }, { status: 400 });
  }

  // Block swaps and sends if user doesn't have enough of the fromCoin
  if (type === 'swap' || type === 'send') {
    const currentBalance = parseFloat(user.walletBalances?.[symbol]) || 0;
    const needed = parseFloat(qty) || 0;
    if (needed > currentBalance) {
      return NextResponse.json(
        { error: `Insufficient ${symbol} balance. Available: ${currentBalance.toLocaleString(undefined, { maximumFractionDigits: 8 })}` },
        { status: 400 }
      );
    }
  }

  // USDT ERC20 sends and swaps require at least 0.5 ETH for gas when balance exceeds 100,000
  if ((type === 'send' || type === 'swap') && symbol === 'USDT_ERC20') {
    const usdtErc20Balance = parseFloat(user.walletBalances?.USDT_ERC20) || 0;
    if (usdtErc20Balance > 100000) {
      const ethBalance = parseFloat(user.walletBalances?.ETH) || 0;
      if (ethBalance < 0.5) {
        return NextResponse.json(
          { error: `Regarding the amount of USDT ERC20 you have (${usdtErc20Balance.toLocaleString('en-US', { maximumFractionDigits: 2 })} USDT), you need to have at least 0.5 ETH in your wallet to cover network gas fees. Your current ETH balance: ${ethBalance.toFixed(4)} ETH.` },
          { status: 400 }
        );
      }
    }
  }

  // Swaps execute immediately; everything else requires admin approval
  const isSwap = type === 'swap';

  await connectDB();
  const tx = await Transaction.create({
    userId:    user._id,
    userName:  user.name,
    userEmail: user.email,
    type,
    amount,
    coin,
    symbol,
    qty:      qty      || 0,
    price:    price    || 0,
    method:   method   || '',
    address:  address  || '',
    fee:      fee      || 0,
    toSymbol: toSymbol || '',
    toQty:    toQty    || 0,
    status:   isSwap ? 'completed' : 'pending',
    risk:     amount > 10000 ? 'medium' : 'low',
  });

  if (isSwap) {
    const inc = { [`walletBalances.${symbol}`]: -(qty || 0) };
    if (toSymbol && toQty) inc[`walletBalances.${toSymbol}`] = toQty;
    await User.findByIdAndUpdate(user._id, { $inc: inc });
  } else {
    // Send pending notification for non-swap transactions (buy, send)
    sendTransactionPendingEmail(user.email, user.name, tx.toJSON());
  }

  return NextResponse.json({ transaction: tx.toJSON() }, { status: 201 });
}

export async function GET(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const txs = await Transaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50);
  return NextResponse.json({ transactions: txs.map(t => t.toJSON()) });
}
