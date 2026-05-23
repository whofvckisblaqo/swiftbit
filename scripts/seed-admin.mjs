import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';

// Parse .env.local manually
readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) process.env[k.trim()] = v.trim();
});

const ADMIN_EMAIL    = 'admin@swiftbit.io';
const ADMIN_PASSWORD = 'Admin@swiftbit1';
const ADMIN_NAME     = 'SwiftBit Admin';

await mongoose.connect(process.env.MONGODB_URI);

const UserSchema = new mongoose.Schema({
  name:      String,
  email:     { type: String, unique: true },
  password:  String,
  avatar:    String,
  role:      { type: String, default: 'user' },
  status:    { type: String, default: 'active' },
  kycLevel:  { type: Number, default: 0 },
  kycStatus: { type: String, default: 'unverified' },
  vipLevel:  { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
const existing = await User.findOne({ email: ADMIN_EMAIL });
if (existing) {
  await User.updateOne({ email: ADMIN_EMAIL }, { role: 'admin', password: hashed, name: ADMIN_NAME, avatar: 'SA' });
  console.log('Updated existing user to admin:', ADMIN_EMAIL);
} else {
  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashed,
    avatar: 'SA',
    role: 'admin',
  });
  console.log('Admin created!');
}

console.log('Email:   ', ADMIN_EMAIL);
console.log('Password:', ADMIN_PASSWORD);

await mongoose.disconnect();
