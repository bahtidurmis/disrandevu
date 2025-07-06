import connectDB from '../../lib/mongodb';
import Doctor from '../../models/Doctor';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await connectDB();

    if (req.method === 'DELETE') {
      // Delete doctor
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