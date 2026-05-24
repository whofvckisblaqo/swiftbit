import mongoose from 'mongoose';

const LoanSchema = new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName:         { type: String, required: true },
  collateral:       { type: String, required: true },   // coin symbol e.g. BTC
  collateralAmount: { type: Number, required: true },   // USD value of collateral
  loanAmount:       { type: Number, required: true },   // USD value of loan
  interestRate:     { type: Number, required: true },   // percent e.g. 8.5
  ltv:              { type: Number, required: true },   // loan-to-value percent e.g. 50
  status:           { type: String, enum: ['active', 'repaid', 'defaulted', 'liquidated'], default: 'active' },
  health:           { type: String, enum: ['healthy', 'warning', 'danger'], default: 'healthy' },
  dueDate:          { type: Date, required: true },
}, { timestamps: true });

LoanSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return {
    id:               obj._id.toString(),
    userId:           obj.userId.toString(),
    userName:         obj.userName,
    collateral:       obj.collateral,
    collateralAmt:    `$${obj.collateralAmount.toLocaleString()}`,
    loan:             `$${obj.loanAmount.toLocaleString()}`,
    interest:         `${obj.interestRate}%`,
    ltv:              `${obj.ltv}%`,
    status:           obj.status,
    health:           obj.health,
    due:              new Date(obj.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    createdAt:        obj.createdAt,
  };
};

export default mongoose.models.Loan || mongoose.model('Loan', LoanSchema);
