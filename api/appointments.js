import connectDB from '../lib/mongodb';
import Appointment from '../models/Appointment';
import User from '../models/User';
import Doctor from '../models/Doctor';

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get appointments with manual populate
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
    else if (req.method === 'POST') {
      // Create new appointment
      const existingAppointment = await Appointment.findOne({
        doctorId: req.body.doctorId,
        date: { $in: [req.body.date, new Date(req.body.date)] },
        time: req.body.time
      });

      if (existingAppointment) {
        return res.status(400).json({ message: 'Bu saat için randevu dolu' });
      }

      const appointment = new Appointment({
        userId: req.body.userId,
        doctorId: req.body.doctorId,
        date: req.body.date,
        time: req.body.time
      });

      const newAppointment = await appointment.save();
      res.status(201).json(newAppointment);
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 