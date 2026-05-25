import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { sendOtpEmail } from '@/lib/mailer';

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const user = await User.create({ name, email, password, emailVerificationOtp: otp, emailVerificationOtpExpiry: otpExpiry });

    sendOtpEmail(user.email, otp);

    return NextResponse.json({ requiresVerification: true, email: user.email }, { status: 201 });
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
