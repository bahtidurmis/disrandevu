import connectDB from '../../lib/mongodb';
import Appointment from '../../models/Appointment';
import User from '../../models/User';
import Doctor from '../../models/Doctor';

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get all appointments with manual populate
      const appointments = await Appointment.find();
      const users = await User.find();
      const doctors = await Doctor.find();
      
      const appointmentsWithDetails = appointments.map(app => ({
        ...app.toObject(),
        userId: users.find(u => u._id.toString() === app.userId.toString()),
        doctorId: doctors.find(d => d._id.toString() === app.doctorId.toString())
      }));
      
      res.status(200).json(appointmentsWithDetails);
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 