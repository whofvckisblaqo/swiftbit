import mongoose from 'mongoose';

const SupportTicketSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName:  { type: String, required: true },
  userEmail: { type: String, required: true },
  subject:   { type: String, required: true },
  message:   { type: String, default: '' },
  priority:  { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status:    { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
}, { timestamps: true });

SupportTicketSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return {
    id:        obj._id.toString(),
    userId:    obj.userId.toString(),
    userName:  obj.userName,
    userEmail: obj.userEmail,
    subject:   obj.subject,
    message:   obj.message,
    priority:  obj.priority,
    status:    obj.status,
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

export default mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);
