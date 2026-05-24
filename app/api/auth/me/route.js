import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    await connectDB();
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const pendingNotifications = user.pendingNotifications?.length
      ? user.pendingNotifications.map(n => ({ title: n.title, body: n.body, type: n.type }))
      : [];

    // Clear them so they're only delivered once
    if (pendingNotifications.length > 0) {
      User.findByIdAndUpdate(decoded.id, { $set: { pendingNotifications: [] } }, { strict: false }).catch(() => {});
    }

    return NextResponse.json({ user: user.toSafeObject(), pendingNotifications });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
