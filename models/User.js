import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const WalletAddressSchema = new mongoose.Schema({
  BTC:       { type: String, default: '' },
  ETH:       { type: String, default: '' },
  USDT_TRC20:{ type: String, default: '' },
  USDT_ERC20:{ type: String, default: '' },
  BNB:       { type: String, default: '' },
  SOL:       { type: String, default: '' },
  XRP:       { type: String, default: '' },
  DOGE:      { type: String, default: '' },
  ADA:       { type: String, default: '' },
}, { _id: false });

const WalletBalanceSchema = new mongoose.Schema({
  BTC:       { type: Number, default: 0 },
  ETH:       { type: Number, default: 0 },
  USDT_TRC20:{ type: Number, default: 0 },
  USDT_ERC20:{ type: Number, default: 0 },
  BNB:       { type: Number, default: 0 },
  SOL:       { type: Number, default: 0 },
  XRP:       { type: Number, default: 0 },
  DOGE:      { type: Number, default: 0 },
  ADA:       { type: Number, default: 0 },
}, { _id: false });

const KycDataSchema = new mongoose.Schema({
  firstName:      { type: String, default: '' },
  lastName:       { type: String, default: '' },
  dateOfBirth:    { type: String, default: '' },
  country:        { type: String, default: '' },
  documentType:   { type: String, default: '' },
  documentNumber: { type: String, default: '' },
  submittedAt:    { type: Date },
}, { _id: false });

const UserSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true, trim: true },
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:        { type: String, required: true, minlength: 8, select: false },
    avatar:          { type: String, default: '' },
    kycLevel:        { type: Number, default: 0 },
    kycStatus:       { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
    kycData:         { type: KycDataSchema, default: () => ({}) },
    vipLevel:        { type: Number, default: 0 },
    role:            { type: String, enum: ['user', 'admin'], default: 'user' },
    status:          { type: String, enum: ['active', 'suspended'], default: 'active' },
    walletAddresses:      { type: WalletAddressSchema, default: () => ({}) },
    walletBalances:       { type: WalletBalanceSchema,  default: () => ({}) },
    pendingNotifications: {
      type: [new mongoose.Schema(
        { title: String, body: String, type: { type: String, default: 'account' } },
        { _id: false }
      )],
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.pre('save', function () {
  if (!this.isModified('name') && this.avatar) return;
  this.avatar = this.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.toSafeObject = function () {
  return {
    id:              this._id.toString(),
    name:            this.name,
    email:           this.email,
    avatar:          this.avatar,
    kycLevel:        this.kycLevel,
    kycStatus:       this.kycStatus,
    kycSubmitted:    !!(this.kycData?.submittedAt),
    vipLevel:        this.vipLevel,
    role:            this.role,
    status:          this.status,
    walletAddresses: this.walletAddresses?.toObject ? this.walletAddresses.toObject() : (this.walletAddresses || {}),
    walletBalances:  this.walletBalances?.toObject  ? this.walletBalances.toObject()  : (this.walletBalances  || {}),
    joinedDate:      this.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
