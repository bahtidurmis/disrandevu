const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.railway.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// MongoDB Bağlantısı (RAM Optimized)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dentist-appointment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));

// Doctor Model
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  available: { type: Boolean, default: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

// API Routes
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/doctors', async (req, res) => {
  const doctor = new Doctor({
    name: req.body.name,
    specialty: req.body.specialty,
    available: req.body.available
  });

  try {
    const newDoctor = await doctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User Model
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// User Routes
app.post('/api/register', async (req, res) => {
  try {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // Gerçek uygulamada şifre hashlenmelidir
      phone: req.body.phone
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Gerçek uygulamada şifre kontrolü yapılmalıdır
    if (user.password !== req.body.password) {
      return res.status(400).json({ message: 'Geçersiz şifre' });
    }

    res.json({ message: 'Giriş başarılı', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Şifremi unuttum: E-posta kontrol endpointi
app.post('/api/check-email', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu.' });
  }
});

// Appointment Model
const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Appointment Routes
app.post('/api/appointments', async (req, res) => {
  try {
    // Hem string hem Date tipini kontrol et
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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Kullanıcıya ait randevuları getiren endpoint
app.get('/api/appointments/:userId', async (req, res) => {
  try {
    if (req.params.userId === 'all') {
      const appointments = await Appointment.find()
        .populate('doctorId')
        .populate('userId');
      return res.json(appointments);
    }
    const appointments = await Appointment.find({ userId: req.params.userId })
      .populate('doctorId')
      .populate('userId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Belirli bir doktor ve tarihteki randevuları dönen endpoint
app.get('/api/appointments/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    const appointments = await Appointment.find({ doctorId, date }).exec();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Doktor Silme
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doktor silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Tüm randevuları listele
app.get('/api/appointments/all', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctorId')
      .populate('userId');
    console.log('Tüm randevular:', appointments);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Randevu Silme
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Randevu silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Randevu Güncelleme
app.put('/api/appointments/:id', async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        userId: req.body.userId,
        doctorId: req.body.doctorId,
        date: req.body.date,
        time: req.body.time
      },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sunucu başlatılırken admin kullanıcısı yoksa ekle
async function ensureAdminUser() {
  const adminEmail = 'admin@admin.com';
  const adminPassword = 'admin123';
  const admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      password: adminPassword,
      phone: '0000000000'
    });
    console.log('Admin kullanıcısı oluşturuldu: admin@admin.com / admin123');
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await ensureAdminUser();
  console.log(`Server ${PORT} portunda çalışıyor`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing HTTP server...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, closing HTTP server...');
  mongoose.connection.close();
  process.exit(0);
}); 