import mongoose from 'mongoose';
const { Schema } = mongoose;

const readingSchema = new Schema({
  robotId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  battery: Number,
  temperature: Number,
  cpuUsage: Number,
  memoryUsage: Number,
  signalStrength: Number,
});

const Reading = mongoose.model('Reading', readingSchema);
export default Reading;
