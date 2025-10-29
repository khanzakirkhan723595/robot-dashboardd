import mongoose from 'mongoose';
const { Schema } = mongoose;

const robotSchema = new Schema({
  robotId: { type: String, required: true, unique: true },
  firmware: String,
  location: String,
  lastMaintenance: Date,
});

const Robot = mongoose.model('Robot', robotSchema);
export default Robot;
