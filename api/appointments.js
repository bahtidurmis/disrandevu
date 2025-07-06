import connectDB from '../lib/mongodb';
import Appointment from '../models/Appointment';

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get appointments
      const appointments = await Appointment.find()
        .populate('doctorId')
        .populate('userId');
      res.status(200).json(appointments);
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