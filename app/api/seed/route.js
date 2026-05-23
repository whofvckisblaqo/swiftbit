import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function GET(req) {
  const secret = new URL(req.url).searchParams.get('secret');
  if (secret !== 'swiftbit-seed-2024') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await connectDB();

  const hashed = await bcrypt.hash('Admin@swiftbit1', 12);
  const result = await mongoose.connection.collection('users').updateOne(
    { email: 'admin@swiftbit.io' },
    {
      $set: { password: hashed, role: 'admin', name: 'SwiftBit Admin', avatar: 'SA', status: 'active' },
      $setOnInsert: { kycLevel: 0, kycStatus: 'unverified', vipLevel: 0, createdAt: new Date(), updatedAt: new Date() },
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true, matched: result.matchedCount, upserted: result.upsertedCount });
}
