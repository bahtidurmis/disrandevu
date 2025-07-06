import connectDB from '../../lib/mongodb';
import Appointment from '../../models/Appointment';
import User from '../../models/User';
import Doctor from '../../models/Doctor';

export default async function handler(req, res) {
  const { userId } = req.query;

  try {
    await connectDB();

    if (req.method === 'GET') {
      if (userId === 'all') {
        // Admin: Get all appointments with manual populate
        const appointments = await Appointment.find();
        const users = await User.find();
        const doctors = await Doctor.find();
        
        const appointmentsWithDetails = appointments.map(app => ({
          ...app.toObject(),
          userId: users.find(u => u._id.toString() === app.userId.toString()),
          doctorId: doctors.find(d => d._id.toString() === app.doctorId.toString())
        }));
        
        return res.status(200).json(appointmentsWithDetails);
      }
      
      // Get user's appointments with manual populate
      const appointments = await Appointment.find({ userId });
      const doctors = await Doctor.find();
      
      const appointmentsWithDetails = appointments.map(app => ({
        ...app.toObject(),
        doctorId: doctors.find(d => d._id.toString() === app.doctorId.toString())
      }));
      
      res.status(200).json(appointmentsWithDetails);
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