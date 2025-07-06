import connectDB from '../lib/mongodb';
import Doctor from '../models/Doctor';

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get all doctors
      const doctors = await Doctor.find();
      res.status(200).json(doctors);
    } 
    else if (req.method === 'POST') {
      // Add new doctor
      const doctor = new Doctor({
        name: req.body.name,
        specialty: req.body.specialty,
        available: req.body.available
      });

      const newDoctor = await doctor.save();
      res.status(201).json(newDoctor);
    }
    else if (req.method === 'DELETE') {
      // Delete doctor (for admin)
      const { id } = req.query;
      await Doctor.findByIdAndDelete(id);
      res.status(200).json({ message: 'Doktor silindi' });
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 