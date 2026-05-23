import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';

readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) process.env[k.trim()] = v.join('=').trim();
});

const uri = process.env.MONGODB_URI_ATLAS || 'mongodb+srv://swiftbit:kim77952468@cluster0.axvmyvt.mongodb.net/swiftbit?appName=Cluster0';
await mongoose.connect(uri);

const user = await mongoose.connection.collection('users').findOne({ email: 'admin@swiftbit.io' });
if (!user) { console.log('NOT FOUND in Atlas'); process.exit(); }

console.log('Found user:', { email: user.email, role: user.role, hasPassword: !!user.password, passwordStart: user.password?.slice(0,10) });

const match = await bcrypt.compare('Admin@swiftbit1', user.password);
console.log('Password match for Admin@swiftbit1:', match);

await mongoose.disconnect();
