import connectDB from '../../../lib/mongodb';
import Appointment from '../../../models/Appointment';

export default async function handler(req, res) {
  const { doctorId } = req.query;

  try {
    await connectDB();

    if (req.method === 'GET') {
      const { date } = req.query;
      const appointments = await Appointment.find({ doctorId, date }).exec();
      res.status(200).json(appointments);
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 