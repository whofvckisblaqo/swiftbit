import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

async function getAuthedUser(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;
  try {
    const decoded = verifyToken(token);
    await connectDB();
    return await User.findById(decoded.id).select('+password');
  } catch { return null; }
}

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(auth.slice(7));
    await connectDB();
    const user = await User.findById(decoded.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const pendingNotifications = user.pendingNotifications?.length
      ? user.pendingNotifications.map(n => ({ title: n.title, body: n.body, type: n.type }))
      : [];

    if (pendingNotifications.length > 0) {
      User.findByIdAndUpdate(decoded.id, { $set: { pendingNotifications: [] } }, { strict: false }).catch(() => {});
    }

    return NextResponse.json({ user: user.toSafeObject(), pendingNotifications });
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

export async function PATCH(req) {
  const user = await getAuthedUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, currentPassword, newPassword } = body;

  if (name) {
    user.name = name.trim();
  }

  if (currentPassword && newPassword) {
    const valid = await user.comparePassword(currentPassword);
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    if (newPassword.length < 8) return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    user.password = newPassword;
  }

  await user.save();
  return NextResponse.json({ user: user.toSafeObject() });
}
