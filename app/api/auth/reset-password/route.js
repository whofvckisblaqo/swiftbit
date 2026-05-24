import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { resetToken, newPassword } = await req.json();
    if (!resetToken || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Reset link is invalid or has expired' }, { status: 400 });
    }

    if (payload.purpose !== 'reset') {
      return NextResponse.json({ error: 'Invalid reset token' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(payload.id).select('+password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.password = newPassword;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('reset-password error:', err);
    return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 500 });
  }
}
