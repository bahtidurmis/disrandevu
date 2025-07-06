import connectDB from '../lib/mongodb';
import User from '../models/User';

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'POST') {
      const { action, ...userData } = req.body;

      if (action === 'login') {
        // Login
        const user = await User.findOne({ email: userData.email });
        if (!user) {
          return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
        }

        if (user.password !== userData.password) {
          return res.status(400).json({ message: 'Geçersiz şifre' });
        }

        res.status(200).json({ message: 'Giriş başarılı', user });
      } 
      else if (action === 'register') {
        // Register
        const user = new User({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          phone: userData.phone
        });

        const newUser = await user.save();
        res.status(201).json(newUser);
      }
      else {
        res.status(400).json({ message: 'Invalid action' });
      }
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 