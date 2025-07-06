import connectDB from '../../lib/mongodb';
import Appointment from '../../models/Appointment';

export default async function handler(req, res) {
  const { userId } = req.query;

  try {
    await connectDB();

    if (req.method === 'GET') {
      if (userId === 'all') {
        // Admin: Get all appointments
        const appointments = await Appointment.find()
          .populate('doctorId')
          .populate('userId');
        return res.status(200).json(appointments);
      }
      
      // Get user's appointments
      const appointments = await Appointment.find({ userId })
        .populate('doctorId')
        .populate('userId');
      res.status(200).json(appointments);
    }
    else if (req.method === 'DELETE') {
      // Delete appointment
      await Appointment.findByIdAndDelete(userId);
      res.status(200).json({ message: 'Randevu silindi' });
    }
    else if (req.method === 'PUT') {
      // Update appointment
      const updated = await Appointment.findByIdAndUpdate(
        userId,
        {
          userId: req.body.userId,
          doctorId: req.body.doctorId,
          date: req.body.date,
          time: req.body.time
        },
        { new: true }
      );
      res.status(200).json(updated);
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 