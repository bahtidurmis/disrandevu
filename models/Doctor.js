import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  available: { type: Boolean, default: true }
});

export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema); 