import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+resetOtp +resetOtpExpiry');

    if (!user || !user.resetOtp) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    if (user.resetOtp !== otp) {
      return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
    }

    if (new Date() > new Date(user.resetOtpExpiry)) {
      return NextResponse.json({ error: 'This code has expired. Request a new one.' }, { status: 400 });
    }

    // Generate a short-lived reset token (10 minutes)
    const resetToken = jwt.sign(
      { id: user._id.toString(), purpose: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    // Clear the OTP so it can't be reused
    await User.findByIdAndUpdate(user._id, {
      $set: { resetOtp: null, resetOtpExpiry: null },
    }, { strict: false });

    return NextResponse.json({ resetToken });
  } catch (err) {
    console.error('verify-otp error:', err);
    return NextResponse.json({ error: 'Something went wrong. Try again.' }, { status: 500 });
  }
}
