import connectDB from '../../lib/mongodb';
import Appointment from '../../models/Appointment';

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const appointments = await Appointment.find()
        .populate('doctorId')
        .populate('userId');
      res.status(200).json(appointments);
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 