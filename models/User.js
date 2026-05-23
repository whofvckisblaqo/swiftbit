import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true, minlength: 8, select: false },
    avatar:    { type: String, default: '' },
    kycLevel:  { type: Number, default: 0 },
    kycStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
    vipLevel:  { type: Number, default: 0 },
    role:      { type: String, enum: ['user', 'admin'], default: 'user' },
    status:    { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
);

/* Hash password before save */
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

/* Generate avatar initials */
UserSchema.pre('save', function () {
  if (!this.isModified('name') && this.avatar) return;
  this.avatar = this.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
});

/* Compare password */
UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

/* Strip sensitive fields from JSON output */
UserSchema.methods.toSafeObject = function () {
  return {
    id:         this._id.toString(),
    name:       this.name,
    email:      this.email,
    avatar:     this.avatar,
    kycLevel:   this.kycLevel,
    kycStatus:  this.kycStatus,
    vipLevel:   this.vipLevel,
    role:       this.role,
    status:     this.status,
    joinedDate: this.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
