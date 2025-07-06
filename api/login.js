import connectDB from '../lib/mongodb';
import User from '../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (user.password !== req.body.password) {
      return res.status(400).json({ message: 'Geçersiz şifre' });
    }

    res.status(200).json({ message: 'Giriş başarılı', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 