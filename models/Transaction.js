import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName:   { type: String, required: true },
  userEmail:  { type: String, required: true },
  type:       { type: String, enum: ['deposit', 'withdrawal', 'buy', 'sell', 'swap', 'send', 'receive'], required: true },
  amount:     { type: Number, required: true },   // USD value
  coin:       { type: String, required: true },   // full name e.g. Bitcoin
  symbol:     { type: String, required: true },   // BTC
  qty:        { type: Number, default: 0 },        // crypto units
  price:      { type: Number, default: 0 },        // coin price at time
  method:     { type: String, default: '' },       // Crypto / Bank Transfer / Card
  address:    { type: String, default: '' },       // destination address
  risk:       { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  status:     { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  fee:        { type: Number, default: 0 },
  toSymbol:   { type: String, default: '' },   // swap destination coin symbol
  toQty:      { type: Number, default: 0 },    // swap destination amount
}, { timestamps: true });

TransactionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return {
    id:        obj._id.toString(),
    userId:    obj.userId.toString(),
    userName:  obj.userName,
    userEmail: obj.userEmail,
    type:      obj.type,
    amount:    obj.amount,
    amountFormatted: `$${obj.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    coin:      obj.coin,
    symbol:    obj.symbol,
    qty:       obj.qty,
    price:     obj.price,
    method:    obj.method,
    address:   obj.address,
    risk:      obj.risk,
    status:    obj.status,
    fee:       obj.fee,
    toSymbol:  obj.toSymbol || '',
    toQty:     obj.toQty    || 0,
    createdAt: obj.createdAt,
    time:      timeAgo(obj.createdAt),
  };
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
