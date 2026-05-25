import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { sendOtpEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: true }); // silent for security

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      $set: { emailVerificationOtp: otp, emailVerificationOtpExpiry: otpExpiry },
    });

    sendOtpEmail(user.email, otp);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[resend-verification]', err);
    return NextResponse.json({ error: 'Failed to resend code' }, { status: 500 });
  }
}
