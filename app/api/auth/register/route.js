import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const user = await User.create({ name, email, password });
    const token = signToken({ id: user._id, email: user.email, role: user.role });

    return NextResponse.json({ token, user: user.toSafeObject() }, { status: 201 });
  } catch (err) {
    console.error('[register]', err);
    // Return actual error temporarily for debugging
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
