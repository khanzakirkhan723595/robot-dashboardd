import mongoose from 'mongoose';
const { Schema } = mongoose;

const alertSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['info', 'warning', 'error'], required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
});

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
