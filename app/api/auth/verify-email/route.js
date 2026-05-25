import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    if (
      !user.emailVerificationOtp ||
      user.emailVerificationOtp !== otp ||
      !user.emailVerificationOtpExpiry ||
      new Date() > new Date(user.emailVerificationOtpExpiry)
    ) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
    }

    await User.findByIdAndUpdate(user._id, {
      $unset: { emailVerificationOtp: '', emailVerificationOtpExpiry: '' },
      $set: { emailVerified: true },
    });

    sendWelcomeEmail(user.email, user.name);

    const token = signToken({ id: user._id, email: user.email, role: user.role });
    return NextResponse.json({ token, user: user.toSafeObject() });
  } catch (err) {
    console.error('[verify-email]', err);
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}
